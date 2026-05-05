// https://cdn.jsdelivr.net/npm/vest-utils@2.0.17/dist/exports/minifyObject.mjs
import { S as isFunction, a as isObject, o as isUnsafeKey, r as isArray, s as isStringValue, t as isEmpty, u as isNullish } from "./vest-isEmpty-2.0.17.js";

//#region src/exports/minifyObject.ts
function genMinifiedKey() {
	const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
	let index = 0;
	return function next() {
		let code = "";
		let x = index;
		do {
			code = code + chars[x % 70];
			x = Math.floor(x / 70);
		} while (x > 0);
		index++;
		return code;
	};
}
function minifyObject(obj, replacer = (v) => v) {
	const countMap = /* @__PURE__ */ new Map();
	countOccurrences(obj, countMap, replacer);
	const maps = genMap(countMap);
	return [minifyObjectImpl(obj, maps.map, replacer), maps.reverseMap];
}
function genMap(countMap) {
	const counts = [];
	for (const [value, count] of countMap) if (count > 1) counts.push({
		value,
		count
	});
	const sorted = counts.sort((a, z) => z.count - a.count);
	const getKey = genMinifiedKey();
	return sorted.reduce((maps, { value }) => {
		if (!shouldAddToMap(value, maps.keyLength)) return maps;
		let key;
		do
			key = getKey();
		while (countMap.has(key));
		maps.map.set(value, key);
		maps.reverseMap[key] = value;
		maps.keyLength = key.length;
		return maps;
	}, {
		map: /* @__PURE__ */ new Map(),
		reverseMap: {},
		keyLength: 1
	});
}
function shouldAddToMap(value, keyLength) {
	return value.toString().length >= keyLength;
}
function addCount(value, countMap) {
	countMap.set(value, (countMap.get(value) || 0) + 1);
}
function countOccurrences(obj, countMap, replacer) {
	for (const key in obj) {
		const value = replacer(obj[key], key);
		if (!shouldMinify(value)) continue;
		if (!Array.isArray(obj)) addCount(key, countMap);
		if (isObject(value)) countOccurrences(value, countMap, replacer);
		else addCount(value, countMap);
	}
}
function isNonSerializable(value) {
	return isNullish(value) || isFunction(value) || typeof value === "symbol";
}
function shouldMinify(value) {
	if (isObject(value) && isEmpty(value)) return false;
	if (isNonSerializable(value)) return false;
	return true;
}
function minifyObjectImpl(obj, map, replacer) {
	const minifiedObject = getRootNode(obj);
	for (const key in obj) {
		const value = replacer(obj[key], key);
		if (!shouldMinify(value)) continue;
		let minifiedValue;
		if (isObject(value)) minifiedValue = minifyObjectImpl(value, map, replacer);
		else minifiedValue = minifyValue(value, map);
		setValue(minifiedObject, minifiedValue, minifyValue(key, map));
	}
	return minifiedObject;
}
function minifyValue(value, map) {
	return map.get(value) ?? value;
}
function expandSingle(value, map) {
	if (isStringValue(value)) return map[value] ?? value;
	return value;
}
function expandObject(minifiedObj, map) {
	const expandedObject = getRootNode(minifiedObj);
	for (const key in minifiedObj) {
		let expandedValue;
		const value = minifiedObj[key];
		if (isObject(value)) expandedValue = expandObject(value, map);
		else expandedValue = expandSingle(value, map);
		const expandedKey = expandSingle(key, map);
		setValue(expandedObject, expandedValue, expandedKey);
	}
	return expandedObject;
}
function setValue(container, value, key) {
	if (isUnsafeKey(key)) return;
	if (isArray(container)) container.push(value);
	else container[key] = value;
}
function getRootNode(node) {
	return isArray(node) ? [] : {};
}

//#endregion
export { expandObject, minifyObject };
