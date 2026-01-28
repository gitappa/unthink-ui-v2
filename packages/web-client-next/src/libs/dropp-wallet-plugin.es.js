import { useState as v, useEffect as Ne, useCallback as ne } from "react";
import { HederaChainId as bt, DAppConnector as Et } from "@hashgraph/hedera-wallet-connect";
import { LedgerId as St } from "@hashgraph/sdk";

function Ve(e, t) {
  return function () {
    return e.apply(t, arguments);
  };
}
const { toString: Rt } = Object.prototype, { getPrototypeOf: Se } = Object, { iterator: ce, toStringTag: Ke } = Symbol, le = /* @__PURE__ */ ((e) => (t) => {
  const n = Rt.call(t);
  return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), F = (e) => (e = e.toLowerCase(), (t) => le(t) === e), ue = (e) => (t) => typeof t === e, { isArray: V } = Array, J = ue("undefined");
function Q(e) {
  return e !== null && !J(e) && e.constructor !== null && !J(e.constructor) && N(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const Xe = F("ArrayBuffer");
function Ot(e) {
  let t;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && Xe(e.buffer), t;
}
const At = ue("string"), N = ue("function"), Ge = ue("number"), Z = (e) => e !== null && typeof e == "object", Tt = (e) => e === !0 || e === !1, se = (e) => {
  if (le(e) !== "object")
    return !1;
  const t = Se(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Ke in e) && !(ce in e);
}, Ct = (e) => {
  if (!Z(e) || Q(e))
    return !1;
  try {
    return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype;
  } catch {
    return !1;
  }
}, xt = F("Date"), _t = F("File"), Nt = F("Blob"), Pt = F("FileList"), Ut = (e) => Z(e) && N(e.pipe), Ft = (e) => {
  let t;
  return e && (typeof FormData == "function" && e instanceof FormData || N(e.append) && ((t = le(e)) === "formdata" || // detect form-data instance
    t === "object" && N(e.toString) && e.toString() === "[object FormData]"));
}, Lt = F("URLSearchParams"), [Dt, It, kt, Bt] = ["ReadableStream", "Request", "Response", "Headers"].map(F), jt = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Y(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let r, s;
  if (typeof e != "object" && (e = [e]), V(e))
    for (r = 0, s = e.length; r < s; r++)
      t.call(null, e[r], r, e);
  else {
    if (Q(e))
      return;
    const i = n ? Object.getOwnPropertyNames(e) : Object.keys(e), o = i.length;
    let c;
    for (r = 0; r < o; r++)
      c = i[r], t.call(null, e[c], c, e);
  }
}
function Qe(e, t) {
  if (Q(e))
    return null;
  t = t.toLowerCase();
  const n = Object.keys(e);
  let r = n.length, s;
  for (; r-- > 0;)
    if (s = n[r], t === s.toLowerCase())
      return s;
  return null;
}
const M = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, Ze = (e) => !J(e) && e !== M;
function we() {
  const { caseless: e, skipUndefined: t } = Ze(this) && this || {}, n = {}, r = (s, i) => {
    const o = e && Qe(n, i) || i;
    se(n[o]) && se(s) ? n[o] = we(n[o], s) : se(s) ? n[o] = we({}, s) : V(s) ? n[o] = s.slice() : (!t || !J(s)) && (n[o] = s);
  };
  for (let s = 0, i = arguments.length; s < i; s++)
    arguments[s] && Y(arguments[s], r);
  return n;
}
const qt = (e, t, n, { allOwnKeys: r } = {}) => (Y(t, (s, i) => {
  n && N(s) ? e[i] = Ve(s, n) : e[i] = s;
}, { allOwnKeys: r }), e), Ht = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), Mt = (e, t, n, r) => {
  e.prototype = Object.create(t.prototype, r), e.prototype.constructor = e, Object.defineProperty(e, "super", {
    value: t.prototype
  }), n && Object.assign(e.prototype, n);
}, $t = (e, t, n, r) => {
  let s, i, o;
  const c = {};
  if (t = t || {}, e == null) return t;
  do {
    for (s = Object.getOwnPropertyNames(e), i = s.length; i-- > 0;)
      o = s[i], (!r || r(o, e, t)) && !c[o] && (t[o] = e[o], c[o] = !0);
    e = n !== !1 && Se(e);
  } while (e && (!n || n(e, t)) && e !== Object.prototype);
  return t;
}, zt = (e, t, n) => {
  e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
  const r = e.indexOf(t, n);
  return r !== -1 && r === n;
}, Wt = (e) => {
  if (!e) return null;
  if (V(e)) return e;
  let t = e.length;
  if (!Ge(t)) return null;
  const n = new Array(t);
  for (; t-- > 0;)
    n[t] = e[t];
  return n;
}, vt = /* @__PURE__ */ ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && Se(Uint8Array)), Jt = (e, t) => {
  const r = (e && e[ce]).call(e);
  let s;
  for (; (s = r.next()) && !s.done;) {
    const i = s.value;
    t.call(e, i[0], i[1]);
  }
}, Vt = (e, t) => {
  let n;
  const r = [];
  for (; (n = e.exec(t)) !== null;)
    r.push(n);
  return r;
}, Kt = F("HTMLFormElement"), Xt = (e) => e.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function (n, r, s) {
    return r.toUpperCase() + s;
  }
), Pe = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), Gt = F("RegExp"), Ye = (e, t) => {
  const n = Object.getOwnPropertyDescriptors(e), r = {};
  Y(n, (s, i) => {
    let o;
    (o = t(s, i, e)) !== !1 && (r[i] = o || s);
  }), Object.defineProperties(e, r);
}, Qt = (e) => {
  Ye(e, (t, n) => {
    if (N(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1)
      return !1;
    const r = e[n];
    if (N(r)) {
      if (t.enumerable = !1, "writable" in t) {
        t.writable = !1;
        return;
      }
      t.set || (t.set = () => {
        throw Error("Can not rewrite read-only method '" + n + "'");
      });
    }
  });
}, Zt = (e, t) => {
  const n = {}, r = (s) => {
    s.forEach((i) => {
      n[i] = !0;
    });
  };
  return V(e) ? r(e) : r(String(e).split(t)), n;
}, Yt = () => {
}, en = (e, t) => e != null && Number.isFinite(e = +e) ? e : t;
function tn(e) {
  return !!(e && N(e.append) && e[Ke] === "FormData" && e[ce]);
}
const nn = (e) => {
  const t = new Array(10), n = (r, s) => {
    if (Z(r)) {
      if (t.indexOf(r) >= 0)
        return;
      if (Q(r))
        return r;
      if (!("toJSON" in r)) {
        t[s] = r;
        const i = V(r) ? [] : {};
        return Y(r, (o, c) => {
          const d = n(o, s + 1);
          !J(d) && (i[c] = d);
        }), t[s] = void 0, i;
      }
    }
    return r;
  };
  return n(e, 0);
}, rn = F("AsyncFunction"), sn = (e) => e && (Z(e) || N(e)) && N(e.then) && N(e.catch), et = ((e, t) => e ? setImmediate : t ? ((n, r) => (M.addEventListener("message", ({ source: s, data: i }) => {
  s === M && i === n && r.length && r.shift()();
}, !1), (s) => {
  r.push(s), M.postMessage(n, "*");
}))(`axios@${Math.random()}`, []) : (n) => setTimeout(n))(
  typeof setImmediate == "function",
  N(M.postMessage)
), on = typeof queueMicrotask < "u" ? queueMicrotask.bind(M) : typeof process < "u" && process.nextTick || et, an = (e) => e != null && N(e[ce]), a = {
  isArray: V,
  isArrayBuffer: Xe,
  isBuffer: Q,
  isFormData: Ft,
  isArrayBufferView: Ot,
  isString: At,
  isNumber: Ge,
  isBoolean: Tt,
  isObject: Z,
  isPlainObject: se,
  isEmptyObject: Ct,
  isReadableStream: Dt,
  isRequest: It,
  isResponse: kt,
  isHeaders: Bt,
  isUndefined: J,
  isDate: xt,
  isFile: _t,
  isBlob: Nt,
  isRegExp: Gt,
  isFunction: N,
  isStream: Ut,
  isURLSearchParams: Lt,
  isTypedArray: vt,
  isFileList: Pt,
  forEach: Y,
  merge: we,
  extend: qt,
  trim: jt,
  stripBOM: Ht,
  inherits: Mt,
  toFlatObject: $t,
  kindOf: le,
  kindOfTest: F,
  endsWith: zt,
  toArray: Wt,
  forEachEntry: Jt,
  matchAll: Vt,
  isHTMLForm: Kt,
  hasOwnProperty: Pe,
  hasOwnProp: Pe,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: Ye,
  freezeMethods: Qt,
  toObjectSet: Zt,
  toCamelCase: Xt,
  noop: Yt,
  toFiniteNumber: en,
  findKey: Qe,
  global: M,
  isContextDefined: Ze,
  isSpecCompliantForm: tn,
  toJSONObject: nn,
  isAsyncFn: rn,
  isThenable: sn,
  setImmediate: et,
  asap: on,
  isIterable: an
};
function y(e, t, n, r, s) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = "AxiosError", t && (this.code = t), n && (this.config = n), r && (this.request = r), s && (this.response = s, this.status = s.status ? s.status : null);
}
a.inherits(y, Error, {
  toJSON: function () {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: a.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const tt = y.prototype, nt = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((e) => {
  nt[e] = { value: e };
});
Object.defineProperties(y, nt);
Object.defineProperty(tt, "isAxiosError", { value: !0 });
y.from = (e, t, n, r, s, i) => {
  const o = Object.create(tt);
  a.toFlatObject(e, o, function (l) {
    return l !== Error.prototype;
  }, (f) => f !== "isAxiosError");
  const c = e && e.message ? e.message : "Error", d = t == null && e ? e.code : t;
  return y.call(o, c, d, n, r, s), e && o.cause == null && Object.defineProperty(o, "cause", { value: e, configurable: !0 }), o.name = e && e.name || "Error", i && Object.assign(o, i), o;
};
const cn = null;
function ge(e) {
  return a.isPlainObject(e) || a.isArray(e);
}
function rt(e) {
  return a.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function Ue(e, t, n) {
  return e ? e.concat(t).map(function (s, i) {
    return s = rt(s), !n && i ? "[" + s + "]" : s;
  }).join(n ? "." : "") : t;
}
function ln(e) {
  return a.isArray(e) && !e.some(ge);
}
const un = a.toFlatObject(a, {}, null, function (t) {
  return /^is[A-Z]/.test(t);
});
function fe(e, t, n) {
  if (!a.isObject(e))
    throw new TypeError("target must be an object");
  t = t || new FormData(), n = a.toFlatObject(n, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function (m, p) {
    return !a.isUndefined(p[m]);
  });
  const r = n.metaTokens, s = n.visitor || l, i = n.dots, o = n.indexes, d = (n.Blob || typeof Blob < "u" && Blob) && a.isSpecCompliantForm(t);
  if (!a.isFunction(s))
    throw new TypeError("visitor must be a function");
  function f(u) {
    if (u === null) return "";
    if (a.isDate(u))
      return u.toISOString();
    if (a.isBoolean(u))
      return u.toString();
    if (!d && a.isBlob(u))
      throw new y("Blob is not supported. Use a Buffer instead.");
    return a.isArrayBuffer(u) || a.isTypedArray(u) ? d && typeof Blob == "function" ? new Blob([u]) : Buffer.from(u) : u;
  }
  function l(u, m, p) {
    let O = u;
    if (u && !p && typeof u == "object") {
      if (a.endsWith(m, "{}"))
        m = r ? m : m.slice(0, -2), u = JSON.stringify(u);
      else if (a.isArray(u) && ln(u) || (a.isFileList(u) || a.endsWith(m, "[]")) && (O = a.toArray(u)))
        return m = rt(m), O.forEach(function (S, C) {
          !(a.isUndefined(S) || S === null) && t.append(
            // eslint-disable-next-line no-nested-ternary
            o === !0 ? Ue([m], C, i) : o === null ? m : m + "[]",
            f(S)
          );
        }), !1;
    }
    return ge(u) ? !0 : (t.append(Ue(p, m, i), f(u)), !1);
  }
  const h = [], b = Object.assign(un, {
    defaultVisitor: l,
    convertValue: f,
    isVisitable: ge
  });
  function A(u, m) {
    if (!a.isUndefined(u)) {
      if (h.indexOf(u) !== -1)
        throw Error("Circular reference detected in " + m.join("."));
      h.push(u), a.forEach(u, function (O, T) {
        (!(a.isUndefined(O) || O === null) && s.call(
          t,
          O,
          a.isString(T) ? T.trim() : T,
          m,
          b
        )) === !0 && A(O, m ? m.concat(T) : [T]);
      }), h.pop();
    }
  }
  if (!a.isObject(e))
    throw new TypeError("data must be an object");
  return A(e), t;
}
function Fe(e) {
  const t = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (r) {
    return t[r];
  });
}
function Re(e, t) {
  this._pairs = [], e && fe(e, this, t);
}
const st = Re.prototype;
st.append = function (t, n) {
  this._pairs.push([t, n]);
};
st.toString = function (t) {
  const n = t ? function (r) {
    return t.call(this, r, Fe);
  } : Fe;
  return this._pairs.map(function (s) {
    return n(s[0]) + "=" + n(s[1]);
  }, "").join("&");
};
function fn(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function ot(e, t, n) {
  if (!t)
    return e;
  const r = n && n.encode || fn;
  a.isFunction(n) && (n = {
    serialize: n
  });
  const s = n && n.serialize;
  let i;
  if (s ? i = s(t, n) : i = a.isURLSearchParams(t) ? t.toString() : new Re(t, n).toString(r), i) {
    const o = e.indexOf("#");
    o !== -1 && (e = e.slice(0, o)), e += (e.indexOf("?") === -1 ? "?" : "&") + i;
  }
  return e;
}
class Le {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(t, n, r) {
    return this.handlers.push({
      fulfilled: t,
      rejected: n,
      synchronous: r ? r.synchronous : !1,
      runWhen: r ? r.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {void}
   */
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(t) {
    a.forEach(this.handlers, function (r) {
      r !== null && t(r);
    });
  }
}
const it = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, dn = typeof URLSearchParams < "u" ? URLSearchParams : Re, pn = typeof FormData < "u" ? FormData : null, hn = typeof Blob < "u" ? Blob : null, mn = {
  isBrowser: !0,
  classes: {
    URLSearchParams: dn,
    FormData: pn,
    Blob: hn
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, Oe = typeof window < "u" && typeof document < "u", be = typeof navigator == "object" && navigator || void 0, yn = Oe && (!be || ["ReactNative", "NativeScript", "NS"].indexOf(be.product) < 0), wn = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts == "function", gn = Oe && window.location.href || "http://localhost", bn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    hasBrowserEnv: Oe,
    hasStandardBrowserEnv: yn,
    hasStandardBrowserWebWorkerEnv: wn,
    navigator: be,
    origin: gn
  }, Symbol.toStringTag, { value: "Module" })), _ = {
    ...bn,
    ...mn
  };
function En(e, t) {
  return fe(e, new _.classes.URLSearchParams(), {
    visitor: function (n, r, s, i) {
      return _.isNode && a.isBuffer(n) ? (this.append(r, n.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments);
    },
    ...t
  });
}
function Sn(e) {
  return a.matchAll(/\w+|\[(\w*)]/g, e).map((t) => t[0] === "[]" ? "" : t[1] || t[0]);
}
function Rn(e) {
  const t = {}, n = Object.keys(e);
  let r;
  const s = n.length;
  let i;
  for (r = 0; r < s; r++)
    i = n[r], t[i] = e[i];
  return t;
}
function at(e) {
  function t(n, r, s, i) {
    let o = n[i++];
    if (o === "__proto__") return !0;
    const c = Number.isFinite(+o), d = i >= n.length;
    return o = !o && a.isArray(s) ? s.length : o, d ? (a.hasOwnProp(s, o) ? s[o] = [s[o], r] : s[o] = r, !c) : ((!s[o] || !a.isObject(s[o])) && (s[o] = []), t(n, r, s[o], i) && a.isArray(s[o]) && (s[o] = Rn(s[o])), !c);
  }
  if (a.isFormData(e) && a.isFunction(e.entries)) {
    const n = {};
    return a.forEachEntry(e, (r, s) => {
      t(Sn(r), s, n, 0);
    }), n;
  }
  return null;
}
function On(e, t, n) {
  if (a.isString(e))
    try {
      return (t || JSON.parse)(e), a.trim(e);
    } catch (r) {
      if (r.name !== "SyntaxError")
        throw r;
    }
  return (n || JSON.stringify)(e);
}
const ee = {
  transitional: it,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function (t, n) {
    const r = n.getContentType() || "", s = r.indexOf("application/json") > -1, i = a.isObject(t);
    if (i && a.isHTMLForm(t) && (t = new FormData(t)), a.isFormData(t))
      return s ? JSON.stringify(at(t)) : t;
    if (a.isArrayBuffer(t) || a.isBuffer(t) || a.isStream(t) || a.isFile(t) || a.isBlob(t) || a.isReadableStream(t))
      return t;
    if (a.isArrayBufferView(t))
      return t.buffer;
    if (a.isURLSearchParams(t))
      return n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
    let c;
    if (i) {
      if (r.indexOf("application/x-www-form-urlencoded") > -1)
        return En(t, this.formSerializer).toString();
      if ((c = a.isFileList(t)) || r.indexOf("multipart/form-data") > -1) {
        const d = this.env && this.env.FormData;
        return fe(
          c ? { "files[]": t } : t,
          d && new d(),
          this.formSerializer
        );
      }
    }
    return i || s ? (n.setContentType("application/json", !1), On(t)) : t;
  }],
  transformResponse: [function (t) {
    const n = this.transitional || ee.transitional, r = n && n.forcedJSONParsing, s = this.responseType === "json";
    if (a.isResponse(t) || a.isReadableStream(t))
      return t;
    if (t && a.isString(t) && (r && !this.responseType || s)) {
      const o = !(n && n.silentJSONParsing) && s;
      try {
        return JSON.parse(t, this.parseReviver);
      } catch (c) {
        if (o)
          throw c.name === "SyntaxError" ? y.from(c, y.ERR_BAD_RESPONSE, this, null, this.response) : c;
      }
    }
    return t;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: _.classes.FormData,
    Blob: _.classes.Blob
  },
  validateStatus: function (t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
a.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
  ee.headers[e] = {};
});
const An = a.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), Tn = (e) => {
  const t = {};
  let n, r, s;
  return e && e.split(`
`).forEach(function (o) {
    s = o.indexOf(":"), n = o.substring(0, s).trim().toLowerCase(), r = o.substring(s + 1).trim(), !(!n || t[n] && An[n]) && (n === "set-cookie" ? t[n] ? t[n].push(r) : t[n] = [r] : t[n] = t[n] ? t[n] + ", " + r : r);
  }), t;
}, De = /* @__PURE__ */ Symbol("internals");
function G(e) {
  return e && String(e).trim().toLowerCase();
}
function oe(e) {
  return e === !1 || e == null ? e : a.isArray(e) ? e.map(oe) : String(e);
}
function Cn(e) {
  const t = /* @__PURE__ */ Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let r;
  for (; r = n.exec(e);)
    t[r[1]] = r[2];
  return t;
}
const xn = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function he(e, t, n, r, s) {
  if (a.isFunction(r))
    return r.call(this, t, n);
  if (s && (t = n), !!a.isString(t)) {
    if (a.isString(r))
      return t.indexOf(r) !== -1;
    if (a.isRegExp(r))
      return r.test(t);
  }
}
function _n(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (t, n, r) => n.toUpperCase() + r);
}
function Nn(e, t) {
  const n = a.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((r) => {
    Object.defineProperty(e, r + n, {
      value: function (s, i, o) {
        return this[r].call(this, t, s, i, o);
      },
      configurable: !0
    });
  });
}
let P = class {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, r) {
    const s = this;
    function i(c, d, f) {
      const l = G(d);
      if (!l)
        throw new Error("header name must be a non-empty string");
      const h = a.findKey(s, l);
      (!h || s[h] === void 0 || f === !0 || f === void 0 && s[h] !== !1) && (s[h || d] = oe(c));
    }
    const o = (c, d) => a.forEach(c, (f, l) => i(f, l, d));
    if (a.isPlainObject(t) || t instanceof this.constructor)
      o(t, n);
    else if (a.isString(t) && (t = t.trim()) && !xn(t))
      o(Tn(t), n);
    else if (a.isObject(t) && a.isIterable(t)) {
      let c = {}, d, f;
      for (const l of t) {
        if (!a.isArray(l))
          throw TypeError("Object iterator must return a key-value pair");
        c[f = l[0]] = (d = c[f]) ? a.isArray(d) ? [...d, l[1]] : [d, l[1]] : l[1];
      }
      o(c, n);
    } else
      t != null && i(n, t, r);
    return this;
  }
  get(t, n) {
    if (t = G(t), t) {
      const r = a.findKey(this, t);
      if (r) {
        const s = this[r];
        if (!n)
          return s;
        if (n === !0)
          return Cn(s);
        if (a.isFunction(n))
          return n.call(this, s, r);
        if (a.isRegExp(n))
          return n.exec(s);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, n) {
    if (t = G(t), t) {
      const r = a.findKey(this, t);
      return !!(r && this[r] !== void 0 && (!n || he(this, this[r], r, n)));
    }
    return !1;
  }
  delete(t, n) {
    const r = this;
    let s = !1;
    function i(o) {
      if (o = G(o), o) {
        const c = a.findKey(r, o);
        c && (!n || he(r, r[c], c, n)) && (delete r[c], s = !0);
      }
    }
    return a.isArray(t) ? t.forEach(i) : i(t), s;
  }
  clear(t) {
    const n = Object.keys(this);
    let r = n.length, s = !1;
    for (; r--;) {
      const i = n[r];
      (!t || he(this, this[i], i, t, !0)) && (delete this[i], s = !0);
    }
    return s;
  }
  normalize(t) {
    const n = this, r = {};
    return a.forEach(this, (s, i) => {
      const o = a.findKey(r, i);
      if (o) {
        n[o] = oe(s), delete n[i];
        return;
      }
      const c = t ? _n(i) : String(i).trim();
      c !== i && delete n[i], n[c] = oe(s), r[c] = !0;
    }), this;
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const n = /* @__PURE__ */ Object.create(null);
    return a.forEach(this, (r, s) => {
      r != null && r !== !1 && (n[s] = t && a.isArray(r) ? r.join(", ") : r);
    }), n;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...n) {
    const r = new this(t);
    return n.forEach((s) => r.set(s)), r;
  }
  static accessor(t) {
    const r = (this[De] = this[De] = {
      accessors: {}
    }).accessors, s = this.prototype;
    function i(o) {
      const c = G(o);
      r[c] || (Nn(s, o), r[c] = !0);
    }
    return a.isArray(t) ? t.forEach(i) : i(t), this;
  }
};
P.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
a.reduceDescriptors(P.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(r) {
      this[n] = r;
    }
  };
});
a.freezeMethods(P);
function me(e, t) {
  const n = this || ee, r = t || n, s = P.from(r.headers);
  let i = r.data;
  return a.forEach(e, function (c) {
    i = c.call(n, i, s.normalize(), t ? t.status : void 0);
  }), s.normalize(), i;
}
function ct(e) {
  return !!(e && e.__CANCEL__);
}
function K(e, t, n) {
  y.call(this, e ?? "canceled", y.ERR_CANCELED, t, n), this.name = "CanceledError";
}
a.inherits(K, y, {
  __CANCEL__: !0
});
function lt(e, t, n) {
  const r = n.config.validateStatus;
  !n.status || !r || r(n.status) ? e(n) : t(new y(
    "Request failed with status code " + n.status,
    [y.ERR_BAD_REQUEST, y.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4],
    n.config,
    n.request,
    n
  ));
}
function Pn(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return t && t[1] || "";
}
function Un(e, t) {
  e = e || 10;
  const n = new Array(e), r = new Array(e);
  let s = 0, i = 0, o;
  return t = t !== void 0 ? t : 1e3, function (d) {
    const f = Date.now(), l = r[i];
    o || (o = f), n[s] = d, r[s] = f;
    let h = i, b = 0;
    for (; h !== s;)
      b += n[h++], h = h % e;
    if (s = (s + 1) % e, s === i && (i = (i + 1) % e), f - o < t)
      return;
    const A = l && f - l;
    return A ? Math.round(b * 1e3 / A) : void 0;
  };
}
function Fn(e, t) {
  let n = 0, r = 1e3 / t, s, i;
  const o = (f, l = Date.now()) => {
    n = l, s = null, i && (clearTimeout(i), i = null), e(...f);
  };
  return [(...f) => {
    const l = Date.now(), h = l - n;
    h >= r ? o(f, l) : (s = f, i || (i = setTimeout(() => {
      i = null, o(s);
    }, r - h)));
  }, () => s && o(s)];
}
const ae = (e, t, n = 3) => {
  let r = 0;
  const s = Un(50, 250);
  return Fn((i) => {
    const o = i.loaded, c = i.lengthComputable ? i.total : void 0, d = o - r, f = s(d), l = o <= c;
    r = o;
    const h = {
      loaded: o,
      total: c,
      progress: c ? o / c : void 0,
      bytes: d,
      rate: f || void 0,
      estimated: f && c && l ? (c - o) / f : void 0,
      event: i,
      lengthComputable: c != null,
      [t ? "download" : "upload"]: !0
    };
    e(h);
  }, n);
}, Ie = (e, t) => {
  const n = e != null;
  return [(r) => t[0]({
    lengthComputable: n,
    total: e,
    loaded: r
  }), t[1]];
}, ke = (e) => (...t) => a.asap(() => e(...t)), Ln = _.hasStandardBrowserEnv ? /* @__PURE__ */ ((e, t) => (n) => (n = new URL(n, _.origin), e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)))(
  new URL(_.origin),
  _.navigator && /(msie|trident)/i.test(_.navigator.userAgent)
) : () => !0, Dn = _.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(e, t, n, r, s, i, o) {
      if (typeof document > "u") return;
      const c = [`${e}=${encodeURIComponent(t)}`];
      a.isNumber(n) && c.push(`expires=${new Date(n).toUTCString()}`), a.isString(r) && c.push(`path=${r}`), a.isString(s) && c.push(`domain=${s}`), i === !0 && c.push("secure"), a.isString(o) && c.push(`SameSite=${o}`), document.cookie = c.join("; ");
    },
    read(e) {
      if (typeof document > "u") return null;
      const t = document.cookie.match(new RegExp("(?:^|; )" + e + "=([^;]*)"));
      return t ? decodeURIComponent(t[1]) : null;
    },
    remove(e) {
      this.write(e, "", Date.now() - 864e5, "/");
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
function In(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function kn(e, t) {
  return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function ut(e, t, n) {
  let r = !In(t);
  return e && (r || n == !1) ? kn(e, t) : t;
}
const Be = (e) => e instanceof P ? { ...e } : e;
function z(e, t) {
  t = t || {};
  const n = {};
  function r(f, l, h, b) {
    return a.isPlainObject(f) && a.isPlainObject(l) ? a.merge.call({ caseless: b }, f, l) : a.isPlainObject(l) ? a.merge({}, l) : a.isArray(l) ? l.slice() : l;
  }
  function s(f, l, h, b) {
    if (a.isUndefined(l)) {
      if (!a.isUndefined(f))
        return r(void 0, f, h, b);
    } else return r(f, l, h, b);
  }
  function i(f, l) {
    if (!a.isUndefined(l))
      return r(void 0, l);
  }
  function o(f, l) {
    if (a.isUndefined(l)) {
      if (!a.isUndefined(f))
        return r(void 0, f);
    } else return r(void 0, l);
  }
  function c(f, l, h) {
    if (h in t)
      return r(f, l);
    if (h in e)
      return r(void 0, f);
  }
  const d = {
    url: i,
    method: i,
    data: i,
    baseURL: o,
    transformRequest: o,
    transformResponse: o,
    paramsSerializer: o,
    timeout: o,
    timeoutMessage: o,
    withCredentials: o,
    withXSRFToken: o,
    adapter: o,
    responseType: o,
    xsrfCookieName: o,
    xsrfHeaderName: o,
    onUploadProgress: o,
    onDownloadProgress: o,
    decompress: o,
    maxContentLength: o,
    maxBodyLength: o,
    beforeRedirect: o,
    transport: o,
    httpAgent: o,
    httpsAgent: o,
    cancelToken: o,
    socketPath: o,
    responseEncoding: o,
    validateStatus: c,
    headers: (f, l, h) => s(Be(f), Be(l), h, !0)
  };
  return a.forEach(Object.keys({ ...e, ...t }), function (l) {
    const h = d[l] || s, b = h(e[l], t[l], l);
    a.isUndefined(b) && h !== c || (n[l] = b);
  }), n;
}
const ft = (e) => {
  const t = z({}, e);
  let { data: n, withXSRFToken: r, xsrfHeaderName: s, xsrfCookieName: i, headers: o, auth: c } = t;
  if (t.headers = o = P.from(o), t.url = ot(ut(t.baseURL, t.url, t.allowAbsoluteUrls), e.params, e.paramsSerializer), c && o.set(
    "Authorization",
    "Basic " + btoa((c.username || "") + ":" + (c.password ? unescape(encodeURIComponent(c.password)) : ""))
  ), a.isFormData(n)) {
    if (_.hasStandardBrowserEnv || _.hasStandardBrowserWebWorkerEnv)
      o.setContentType(void 0);
    else if (a.isFunction(n.getHeaders)) {
      const d = n.getHeaders(), f = ["content-type", "content-length"];
      Object.entries(d).forEach(([l, h]) => {
        f.includes(l.toLowerCase()) && o.set(l, h);
      });
    }
  }
  if (_.hasStandardBrowserEnv && (r && a.isFunction(r) && (r = r(t)), r || r !== !1 && Ln(t.url))) {
    const d = s && i && Dn.read(i);
    d && o.set(s, d);
  }
  return t;
}, Bn = typeof XMLHttpRequest < "u", jn = Bn && function (e) {
  return new Promise(function (n, r) {
    const s = ft(e);
    let i = s.data;
    const o = P.from(s.headers).normalize();
    let { responseType: c, onUploadProgress: d, onDownloadProgress: f } = s, l, h, b, A, u;
    function m() {
      A && A(), u && u(), s.cancelToken && s.cancelToken.unsubscribe(l), s.signal && s.signal.removeEventListener("abort", l);
    }
    let p = new XMLHttpRequest();
    p.open(s.method.toUpperCase(), s.url, !0), p.timeout = s.timeout;
    function O() {
      if (!p)
        return;
      const S = P.from(
        "getAllResponseHeaders" in p && p.getAllResponseHeaders()
      ), U = {
        data: !c || c === "text" || c === "json" ? p.responseText : p.response,
        status: p.status,
        statusText: p.statusText,
        headers: S,
        config: e,
        request: p
      };
      lt(function (g) {
        n(g), m();
      }, function (g) {
        r(g), m();
      }, U), p = null;
    }
    "onloadend" in p ? p.onloadend = O : p.onreadystatechange = function () {
      !p || p.readyState !== 4 || p.status === 0 && !(p.responseURL && p.responseURL.indexOf("file:") === 0) || setTimeout(O);
    }, p.onabort = function () {
      p && (r(new y("Request aborted", y.ECONNABORTED, e, p)), p = null);
    }, p.onerror = function (C) {
      const U = C && C.message ? C.message : "Network Error", I = new y(U, y.ERR_NETWORK, e, p);
      I.event = C || null, r(I), p = null;
    }, p.ontimeout = function () {
      let C = s.timeout ? "timeout of " + s.timeout + "ms exceeded" : "timeout exceeded";
      const U = s.transitional || it;
      s.timeoutErrorMessage && (C = s.timeoutErrorMessage), r(new y(
        C,
        U.clarifyTimeoutError ? y.ETIMEDOUT : y.ECONNABORTED,
        e,
        p
      )), p = null;
    }, i === void 0 && o.setContentType(null), "setRequestHeader" in p && a.forEach(o.toJSON(), function (C, U) {
      p.setRequestHeader(U, C);
    }), a.isUndefined(s.withCredentials) || (p.withCredentials = !!s.withCredentials), c && c !== "json" && (p.responseType = s.responseType), f && ([b, u] = ae(f, !0), p.addEventListener("progress", b)), d && p.upload && ([h, A] = ae(d), p.upload.addEventListener("progress", h), p.upload.addEventListener("loadend", A)), (s.cancelToken || s.signal) && (l = (S) => {
      p && (r(!S || S.type ? new K(null, e, p) : S), p.abort(), p = null);
    }, s.cancelToken && s.cancelToken.subscribe(l), s.signal && (s.signal.aborted ? l() : s.signal.addEventListener("abort", l)));
    const T = Pn(s.url);
    if (T && _.protocols.indexOf(T) === -1) {
      r(new y("Unsupported protocol " + T + ":", y.ERR_BAD_REQUEST, e));
      return;
    }
    p.send(i || null);
  });
}, qn = (e, t) => {
  const { length: n } = e = e ? e.filter(Boolean) : [];
  if (t || n) {
    let r = new AbortController(), s;
    const i = function (f) {
      if (!s) {
        s = !0, c();
        const l = f instanceof Error ? f : this.reason;
        r.abort(l instanceof y ? l : new K(l instanceof Error ? l.message : l));
      }
    };
    let o = t && setTimeout(() => {
      o = null, i(new y(`timeout ${t} of ms exceeded`, y.ETIMEDOUT));
    }, t);
    const c = () => {
      e && (o && clearTimeout(o), o = null, e.forEach((f) => {
        f.unsubscribe ? f.unsubscribe(i) : f.removeEventListener("abort", i);
      }), e = null);
    };
    e.forEach((f) => f.addEventListener("abort", i));
    const { signal: d } = r;
    return d.unsubscribe = () => a.asap(c), d;
  }
}, Hn = function* (e, t) {
  let n = e.byteLength;
  if (n < t) {
    yield e;
    return;
  }
  let r = 0, s;
  for (; r < n;)
    s = r + t, yield e.slice(r, s), r = s;
}, Mn = async function* (e, t) {
  for await (const n of $n(e))
    yield* Hn(n, t);
}, $n = async function* (e) {
  if (e[Symbol.asyncIterator]) {
    yield* e;
    return;
  }
  const t = e.getReader();
  try {
    for (; ;) {
      const { done: n, value: r } = await t.read();
      if (n)
        break;
      yield r;
    }
  } finally {
    await t.cancel();
  }
}, je = (e, t, n, r) => {
  const s = Mn(e, t);
  let i = 0, o, c = (d) => {
    o || (o = !0, r && r(d));
  };
  return new ReadableStream({
    async pull(d) {
      try {
        const { done: f, value: l } = await s.next();
        if (f) {
          c(), d.close();
          return;
        }
        let h = l.byteLength;
        if (n) {
          let b = i += h;
          n(b);
        }
        d.enqueue(new Uint8Array(l));
      } catch (f) {
        throw c(f), f;
      }
    },
    cancel(d) {
      return c(d), s.return();
    }
  }, {
    highWaterMark: 2
  });
}, qe = 64 * 1024, { isFunction: re } = a, zn = (({ Request: e, Response: t }) => ({
  Request: e,
  Response: t
}))(a.global), {
  ReadableStream: He,
  TextEncoder: Me
} = a.global, $e = (e, ...t) => {
  try {
    return !!e(...t);
  } catch {
    return !1;
  }
}, Wn = (e) => {
  e = a.merge.call({
    skipUndefined: !0
  }, zn, e);
  const { fetch: t, Request: n, Response: r } = e, s = t ? re(t) : typeof fetch == "function", i = re(n), o = re(r);
  if (!s)
    return !1;
  const c = s && re(He), d = s && (typeof Me == "function" ? /* @__PURE__ */ ((u) => (m) => u.encode(m))(new Me()) : async (u) => new Uint8Array(await new n(u).arrayBuffer())), f = i && c && $e(() => {
    let u = !1;
    const m = new n(_.origin, {
      body: new He(),
      method: "POST",
      get duplex() {
        return u = !0, "half";
      }
    }).headers.has("Content-Type");
    return u && !m;
  }), l = o && c && $e(() => a.isReadableStream(new r("").body)), h = {
    stream: l && ((u) => u.body)
  };
  s && ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((u) => {
    !h[u] && (h[u] = (m, p) => {
      let O = m && m[u];
      if (O)
        return O.call(m);
      throw new y(`Response type '${u}' is not supported`, y.ERR_NOT_SUPPORT, p);
    });
  });
  const b = async (u) => {
    if (u == null)
      return 0;
    if (a.isBlob(u))
      return u.size;
    if (a.isSpecCompliantForm(u))
      return (await new n(_.origin, {
        method: "POST",
        body: u
      }).arrayBuffer()).byteLength;
    if (a.isArrayBufferView(u) || a.isArrayBuffer(u))
      return u.byteLength;
    if (a.isURLSearchParams(u) && (u = u + ""), a.isString(u))
      return (await d(u)).byteLength;
  }, A = async (u, m) => {
    const p = a.toFiniteNumber(u.getContentLength());
    return p ?? b(m);
  };
  return async (u) => {
    let {
      url: m,
      method: p,
      data: O,
      signal: T,
      cancelToken: S,
      timeout: C,
      onDownloadProgress: U,
      onUploadProgress: I,
      responseType: g,
      headers: E,
      withCredentials: w = "same-origin",
      fetchOptions: x
    } = ft(u), q = t || fetch;
    g = g ? (g + "").toLowerCase() : "text";
    let X = qn([T, S && S.toAbortSignal()], C), k = null;
    const H = X && X.unsubscribe && (() => {
      X.unsubscribe();
    });
    let Te;
    try {
      if (I && f && p !== "get" && p !== "head" && (Te = await A(E, O)) !== 0) {
        let j = new n(m, {
          method: "POST",
          body: O,
          duplex: "half"
        }), W;
        if (a.isFormData(O) && (W = j.headers.get("content-type")) && E.setContentType(W), j.body) {
          const [pe, te] = Ie(
            Te,
            ae(ke(I))
          );
          O = je(j.body, qe, pe, te);
        }
      }
      a.isString(w) || (w = w ? "include" : "omit");
      const L = i && "credentials" in n.prototype, Ce = {
        ...x,
        signal: X,
        method: p.toUpperCase(),
        headers: E.normalize().toJSON(),
        body: O,
        duplex: "half",
        credentials: L ? w : void 0
      };
      k = i && new n(m, Ce);
      let B = await (i ? q(k, x) : q(m, Ce));
      const xe = l && (g === "stream" || g === "response");
      if (l && (U || xe && H)) {
        const j = {};
        ["status", "statusText", "headers"].forEach((_e) => {
          j[_e] = B[_e];
        });
        const W = a.toFiniteNumber(B.headers.get("content-length")), [pe, te] = U && Ie(
          W,
          ae(ke(U), !0)
        ) || [];
        B = new r(
          je(B.body, qe, pe, () => {
            te && te(), H && H();
          }),
          j
        );
      }
      g = g || "text";
      let gt = await h[a.findKey(h, g) || "text"](B, u);
      return !xe && H && H(), await new Promise((j, W) => {
        lt(j, W, {
          data: gt,
          headers: P.from(B.headers),
          status: B.status,
          statusText: B.statusText,
          config: u,
          request: k
        });
      });
    } catch (L) {
      throw H && H(), L && L.name === "TypeError" && /Load failed|fetch/i.test(L.message) ? Object.assign(
        new y("Network Error", y.ERR_NETWORK, u, k),
        {
          cause: L.cause || L
        }
      ) : y.from(L, L && L.code, u, k);
    }
  };
}, vn = /* @__PURE__ */ new Map(), dt = (e) => {
  let t = e && e.env || {};
  const { fetch: n, Request: r, Response: s } = t, i = [
    r,
    s,
    n
  ];
  let o = i.length, c = o, d, f, l = vn;
  for (; c--;)
    d = i[c], f = l.get(d), f === void 0 && l.set(d, f = c ? /* @__PURE__ */ new Map() : Wn(t)), l = f;
  return f;
};
dt();
const Ae = {
  http: cn,
  xhr: jn,
  fetch: {
    get: dt
  }
};
a.forEach(Ae, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const ze = (e) => `- ${e}`, Jn = (e) => a.isFunction(e) || e === null || e === !1;
function Vn(e, t) {
  e = a.isArray(e) ? e : [e];
  const { length: n } = e;
  let r, s;
  const i = {};
  for (let o = 0; o < n; o++) {
    r = e[o];
    let c;
    if (s = r, !Jn(r) && (s = Ae[(c = String(r)).toLowerCase()], s === void 0))
      throw new y(`Unknown adapter '${c}'`);
    if (s && (a.isFunction(s) || (s = s.get(t))))
      break;
    i[c || "#" + o] = s;
  }
  if (!s) {
    const o = Object.entries(i).map(
      ([d, f]) => `adapter ${d} ` + (f === !1 ? "is not supported by the environment" : "is not available in the build")
    );
    let c = n ? o.length > 1 ? `since :
` + o.map(ze).join(`
`) : " " + ze(o[0]) : "as no adapter specified";
    throw new y(
      "There is no suitable adapter to dispatch the request " + c,
      "ERR_NOT_SUPPORT"
    );
  }
  return s;
}
const pt = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter: Vn,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: Ae
};
function ye(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new K(null, e);
}
function We(e) {
  return ye(e), e.headers = P.from(e.headers), e.data = me.call(
    e,
    e.transformRequest
  ), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), pt.getAdapter(e.adapter || ee.adapter, e)(e).then(function (r) {
    return ye(e), r.data = me.call(
      e,
      e.transformResponse,
      r
    ), r.headers = P.from(r.headers), r;
  }, function (r) {
    return ct(r) || (ye(e), r && r.response && (r.response.data = me.call(
      e,
      e.transformResponse,
      r.response
    ), r.response.headers = P.from(r.response.headers))), Promise.reject(r);
  });
}
const ht = "1.13.2", de = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  de[e] = function (r) {
    return typeof r === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const ve = {};
de.transitional = function (t, n, r) {
  function s(i, o) {
    return "[Axios v" + ht + "] Transitional option '" + i + "'" + o + (r ? ". " + r : "");
  }
  return (i, o, c) => {
    if (t === !1)
      throw new y(
        s(o, " has been removed" + (n ? " in " + n : "")),
        y.ERR_DEPRECATED
      );
    return n && !ve[o] && (ve[o] = !0, console.warn(
      s(
        o,
        " has been deprecated since v" + n + " and will be removed in the near future"
      )
    )), t ? t(i, o, c) : !0;
  };
};
de.spelling = function (t) {
  return (n, r) => (console.warn(`${r} is likely a misspelling of ${t}`), !0);
};
function Kn(e, t, n) {
  if (typeof e != "object")
    throw new y("options must be an object", y.ERR_BAD_OPTION_VALUE);
  const r = Object.keys(e);
  let s = r.length;
  for (; s-- > 0;) {
    const i = r[s], o = t[i];
    if (o) {
      const c = e[i], d = c === void 0 || o(c, i, e);
      if (d !== !0)
        throw new y("option " + i + " must be " + d, y.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (n !== !0)
      throw new y("Unknown option " + i, y.ERR_BAD_OPTION);
  }
}
const ie = {
  assertOptions: Kn,
  validators: de
}, D = ie.validators;
let $ = class {
  constructor(t) {
    this.defaults = t || {}, this.interceptors = {
      request: new Le(),
      response: new Le()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(t, n) {
    try {
      return await this._request(t, n);
    } catch (r) {
      if (r instanceof Error) {
        let s = {};
        Error.captureStackTrace ? Error.captureStackTrace(s) : s = new Error();
        const i = s.stack ? s.stack.replace(/^.+\n/, "") : "";
        try {
          r.stack ? i && !String(r.stack).endsWith(i.replace(/^.+\n.+\n/, "")) && (r.stack += `
` + i) : r.stack = i;
        } catch {
        }
      }
      throw r;
    }
  }
  _request(t, n) {
    typeof t == "string" ? (n = n || {}, n.url = t) : n = t || {}, n = z(this.defaults, n);
    const { transitional: r, paramsSerializer: s, headers: i } = n;
    r !== void 0 && ie.assertOptions(r, {
      silentJSONParsing: D.transitional(D.boolean),
      forcedJSONParsing: D.transitional(D.boolean),
      clarifyTimeoutError: D.transitional(D.boolean)
    }, !1), s != null && (a.isFunction(s) ? n.paramsSerializer = {
      serialize: s
    } : ie.assertOptions(s, {
      encode: D.function,
      serialize: D.function
    }, !0)), n.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? n.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : n.allowAbsoluteUrls = !0), ie.assertOptions(n, {
      baseUrl: D.spelling("baseURL"),
      withXsrfToken: D.spelling("withXSRFToken")
    }, !0), n.method = (n.method || this.defaults.method || "get").toLowerCase();
    let o = i && a.merge(
      i.common,
      i[n.method]
    );
    i && a.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (u) => {
        delete i[u];
      }
    ), n.headers = P.concat(o, i);
    const c = [];
    let d = !0;
    this.interceptors.request.forEach(function (m) {
      typeof m.runWhen == "function" && m.runWhen(n) === !1 || (d = d && m.synchronous, c.unshift(m.fulfilled, m.rejected));
    });
    const f = [];
    this.interceptors.response.forEach(function (m) {
      f.push(m.fulfilled, m.rejected);
    });
    let l, h = 0, b;
    if (!d) {
      const u = [We.bind(this), void 0];
      for (u.unshift(...c), u.push(...f), b = u.length, l = Promise.resolve(n); h < b;)
        l = l.then(u[h++], u[h++]);
      return l;
    }
    b = c.length;
    let A = n;
    for (; h < b;) {
      const u = c[h++], m = c[h++];
      try {
        A = u(A);
      } catch (p) {
        m.call(this, p);
        break;
      }
    }
    try {
      l = We.call(this, A);
    } catch (u) {
      return Promise.reject(u);
    }
    for (h = 0, b = f.length; h < b;)
      l = l.then(f[h++], f[h++]);
    return l;
  }
  getUri(t) {
    t = z(this.defaults, t);
    const n = ut(t.baseURL, t.url, t.allowAbsoluteUrls);
    return ot(n, t.params, t.paramsSerializer);
  }
};
a.forEach(["delete", "get", "head", "options"], function (t) {
  $.prototype[t] = function (n, r) {
    return this.request(z(r || {}, {
      method: t,
      url: n,
      data: (r || {}).data
    }));
  };
});
a.forEach(["post", "put", "patch"], function (t) {
  function n(r) {
    return function (i, o, c) {
      return this.request(z(c || {}, {
        method: t,
        headers: r ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: i,
        data: o
      }));
    };
  }
  $.prototype[t] = n(), $.prototype[t + "Form"] = n(!0);
});
let Xn = class mt {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let n;
    this.promise = new Promise(function (i) {
      n = i;
    });
    const r = this;
    this.promise.then((s) => {
      if (!r._listeners) return;
      let i = r._listeners.length;
      for (; i-- > 0;)
        r._listeners[i](s);
      r._listeners = null;
    }), this.promise.then = (s) => {
      let i;
      const o = new Promise((c) => {
        r.subscribe(c), i = c;
      }).then(s);
      return o.cancel = function () {
        r.unsubscribe(i);
      }, o;
    }, t(function (i, o, c) {
      r.reason || (r.reason = new K(i, o, c), n(r.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : this._listeners = [t];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(t) {
    if (!this._listeners)
      return;
    const n = this._listeners.indexOf(t);
    n !== -1 && this._listeners.splice(n, 1);
  }
  toAbortSignal() {
    const t = new AbortController(), n = (r) => {
      t.abort(r);
    };
    return this.subscribe(n), t.signal.unsubscribe = () => this.unsubscribe(n), t.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let t;
    return {
      token: new mt(function (s) {
        t = s;
      }),
      cancel: t
    };
  }
};
function Gn(e) {
  return function (n) {
    return e.apply(null, n);
  };
}
function Qn(e) {
  return a.isObject(e) && e.isAxiosError === !0;
}
const Ee = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526
};
Object.entries(Ee).forEach(([e, t]) => {
  Ee[t] = e;
});
function yt(e) {
  const t = new $(e), n = Ve($.prototype.request, t);
  return a.extend(n, $.prototype, t, { allOwnKeys: !0 }), a.extend(n, t, null, { allOwnKeys: !0 }), n.create = function (s) {
    return yt(z(e, s));
  }, n;
}
const R = yt(ee);
R.Axios = $;
R.CanceledError = K;
R.CancelToken = Xn;
R.isCancel = ct;
R.VERSION = ht;
R.toFormData = fe;
R.AxiosError = y;
R.Cancel = R.CanceledError;
R.all = function (t) {
  return Promise.all(t);
};
R.spread = Gn;
R.isAxiosError = Qn;
R.mergeConfig = z;
R.AxiosHeaders = P;
R.formToJSON = (e) => at(a.isHTMLForm(e) ? new FormData(e) : e);
R.getAdapter = pt.getAdapter;
R.HttpStatusCode = Ee;
R.default = R;
const {
  Axios: or,
  AxiosError: ir,
  CanceledError: ar,
  isCancel: cr,
  CancelToken: lr,
  VERSION: ur,
  all: fr,
  Cancel: dr,
  isAxiosError: pr,
  spread: hr,
  toFormData: mr,
  AxiosHeaders: yr,
  HttpStatusCode: wr,
  formToJSON: gr,
  getAdapter: br,
  mergeConfig: Er
} = R, wt = R.create({
  baseURL: "https://auraprod.unthink.ai"
}), Je = async (e) => {
  try {
    const t = e.trim().toLowerCase(), n = await wt.get(`/users/get_user_info/?emailId=${t}`);
    return n.data.status === "success" ? n.data.data : null;
  } catch (t) {
    return console.error("Get user info error:", t), null;
  }
}, Zn = async (e) => {
  try {
    const t = await wt.post("/users/save_user_info/", e);
    if (t.data.status === "success")
      return t.data.data;
    throw new Error(t.data.message || "Failed to save user info");
  } catch (t) {
    throw console.error("Save user info error:", t), new Error("Failed to save user info. Please try again.");
  }
};
class Yn {
  constructor(t) {
    this.merchantId = t.merchantId, this.environment = t.environment, this.apiBaseUrl = t.apiBaseUrl || "http://localhost:8080";
  }
  async login(t) {
    console.log("Initiating Dropp Login with options:", t);
    try {
      const n = {
        emailId: t.email
      }, s = (await R.post(`${this.apiBaseUrl}/api/payments/get-authorize-url`, n)).data;
      if (s.success && s.authorizeUrl)
        window.location.href = s.authorizeUrl;
      else
        throw console.error("Failed to get authorize URL:", s), new Error(s.error || "Failed to get authorize URL");
    } catch (n) {
      throw console.error("Dropp Login Error:", n), n;
    }
  }
}
const Sr = (e = {}) => {
  const {
    merchantId: t = process.env.DROPP_MERCHANT_ID,
    environment: n = process.env.DROPP_ENVIRONMENT || "SANDBOX",
    ledgerId: r = St.TESTNET,
    projectId: s = "31267a2a9ddb2185483abcf7d3dc4903",
    networks: i = [bt.Testnet],
    apiBaseUrl: o = "http://localhost:8080"
  } = e, [c, d] = v(!1), [f, l] = v(null), [h, b] = v(null), [A, u] = v(!0), [m, p] = v(""), [O, T] = v(!1);
  Ne(() => {
    (async () => {
      try {
        const E = {
          name: "VTO App",
          description: "Virtual Try-On Application",
          icons: ["https://walletconnect.com/walletconnect-logo.png"],
          url: window.location.origin
        }, w = new Et(
          E,
          r,
          s,
          i
        );
        if (await w.init(), b(w), console.log("Full Connector Object:", w), console.log("Signers:", w.signers), w.signers && w.signers.length > 0) {
          const x = w.signers[0].getAccountId().toString();
          l(x), d(!0), console.log("Wallet ID:", x);
        }
      } catch (E) {
        console.error("Failed to initialize DAppConnector:", E);
      } finally {
        u(!1);
      }
    })();
  }, []);
  const S = ne(async (g, E) => {
    try {
      if (!g) {
        console.warn("User email not provided");
        return;
      }
      const w = await Je(g);
      if (!w) {
        console.error("Could not fetch user info");
        return;
      }
      const x = {
        emailId: w.emailId || g,
        user_name: w.user_name || w.first_name,
        user_id: w.user_id,
        is_influencer: w.is_influencer || !1,
        _id: w._id,
        dropp: {
          testnet: {
            merchantAccount: E,
            currency: "USD",
            hedera_details: {}
          },
          mainnet: {}
        }
      };
      await Zn(x), console.log("Wallet info saved successfully for account:", E), p("✓ Wallet info saved successfully!");
    } catch (w) {
      console.error("Failed to save wallet info:", w), p(`✗ Failed to save wallet info: ${w.message}`);
    }
  }, []), C = ne(async (g) => {
    if (!g) {
      p("⚠️ Please enter an email address first");
      return;
    }
    T(!0), p("Checking user info...");
    try {
      const w = (await Je(g))?.dropp?.testnet?.merchantAccount;
      if (w)
        return l(w), d(!0), p(`✓ Wallet already connected: ${w}`), T(!1), w;
      if (!h)
        throw new Error("DAppConnector not initialized");
      const x = await h.openModal();
      if (x) {
        const q = x.namespaces?.hedera?.accounts || [];
        if (q.length > 0) {
          const k = q[0].split(":").pop();
          return l(k), d(!0), p("Saving wallet info..."), await S(g, k), T(!1), k;
        }
      }
    } catch (E) {
      console.error("Wallet connection failed:", E), p(`✗ Error: ${E.message}`), T(!1);
    }
  }, [h, S]), U = ne(async (g) => {
    if (!g) {
      p("⚠️ Please enter an email address first");
      return;
    }
    localStorage.setItem("dropp_pending_email", g);
    const E = new Yn({
      merchantId: t,
      environment: n,
      apiBaseUrl: o
    }), w = {
      redirectUrl: window.location.href,
      // Return to this page
      purpose: "login",
      email: g
    };
    try {
      await E.login(w);
    } catch (x) {
      console.error("Login redirect failed:", x), p(`✗ Login failed: ${x.message}`);
    }
  }, []), I = ne(async () => {
    if (h)
      try {
        await h.disconnectAll(), Object.keys(localStorage).filter((E) => E.startsWith("wc@2")).forEach((E) => localStorage.removeItem(E)), l(null), d(!1), p("Wallet disconnected");
      } catch (g) {
        console.error("Wallet disconnect failed:", g), l(null), d(!1);
      }
  }, [h]);
  return Ne(() => {
    (async () => {
      const E = new URLSearchParams(window.location.search), w = E.get("account_id") || E.get("merchant_id") || E.get("id"), x = localStorage.getItem("dropp_pending_email");
      if (w && !c) {
        console.log("Found account ID in URL params:", w), l(w), d(!0), x && (await S(x, w), localStorage.removeItem("dropp_pending_email"));
        const q = window.location.pathname;
        window.history.replaceState({}, document.title, q);
      }
    })();
  }, [c, S]), {
    isConnected: c,
    walletId: f,
    isInitializing: A,
    statusMessage: m,
    isLoading: O,
    connectWallet: C,
    disconnectWallet: I,
    loginWithEmail: U
  };
};
export {
  Yn as Dropp,
  Je as getFullUserInfo,
  Zn as saveUserInfo,
  Sr as useDroppWallet
};
