// https://cdn.jsdelivr.net/npm/vest-utils@2.0.17/dist/isEmpty-CklRe5lm.mjs
//#region src/isFunction.ts
function isFunction(value) {
	return typeof value === "function";
}

//#endregion
//#region src/bindNot.ts
function bindNot(fn) {
	return (...args) => !fn(...args);
}

//#endregion
//#region src/isNumeric.ts
function isNumeric(value) {
	const str = String(value);
	const num = Number(value);
	const result = !isNaN(parseFloat(str)) && !isNaN(Number(value)) && isFinite(num);
	return Boolean(result);
}
const isNotNumeric = bindNot(isNumeric);

//#endregion
//#region src/numberEquals.ts
function numberEquals(value, eq) {
	return isNumeric(value) && isNumeric(eq) && Number(value) === Number(eq);
}
const numberNotEquals = bindNot(numberEquals);

//#endregion
//#region src/lengthEquals.ts
function lengthEquals(value, arg1) {
	return numberEquals(value.length, arg1);
}
const lengthNotEquals = bindNot(lengthEquals);

//#endregion
//#region src/isNull.ts
function isNull(value) {
	return value === null;
}
const isNotNull = bindNot(isNull);

//#endregion
//#region src/isUndefined.ts
function isUndefined(value) {
	return value === void 0;
}
const isNotUndefined = bindNot(isUndefined);

//#endregion
//#region src/isNullish.ts
function isNullish(value) {
	return isNull(value) || isUndefined(value);
}
const isNotNullish = bindNot(isNullish);

//#endregion
//#region src/hasOwnProperty.ts
/**
* A safe hasOwnProperty access
*/
function hasOwnProperty(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}

//#endregion
//#region src/isStringValue.ts
function isStringValue(v) {
	return String(v) === v;
}

//#endregion
//#region src/isUnsafeKey.ts
function isUnsafeKey(key) {
	return key === "__proto__" || key === "constructor" || key === "prototype";
}

//#endregion
//#region src/valueIsObject.ts
function isObject(v) {
	return typeof v === "object" && !isNullish(v);
}

//#endregion
//#region src/isArrayValue.ts
function isArray(value) {
	return Boolean(Array.isArray(value));
}
const isNotArray = bindNot(isArray);

//#endregion
//#region src/isEmpty.ts
function isEmpty(value) {
	if (!value) return true;
	else if (hasOwnProperty(value, "length")) return lengthEquals(value, 0);
	else if (isObject(value)) return lengthEquals(Object.keys(value), 0);
	return false;
}
const isNotEmpty = bindNot(isEmpty);

//#endregion
export { isFunction as S, numberEquals as _, isObject as a, isNumeric as b, hasOwnProperty as c, isNotUndefined as d, isUndefined as f, lengthNotEquals as g, lengthEquals as h, isNotArray as i, isNotNullish as l, isNull as m, isNotEmpty as n, isUnsafeKey as o, isNotNull as p, isArray as r, isStringValue as s, isEmpty as t, isNullish as u, numberNotEquals as v, bindNot as x, isNotNumeric as y };
