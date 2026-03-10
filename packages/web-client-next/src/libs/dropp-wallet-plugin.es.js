import { useState as J, useEffect as he, useCallback as ne } from "react";
import { HederaChainId as Et, DAppConnector as St } from "@hashgraph/hedera-wallet-connect";
import { LedgerId as Rt } from "@hashgraph/sdk";
function Ke(e, t) {
  return function() {
    return e.apply(t, arguments);
  };
}
const { toString: Ot } = Object.prototype, { getPrototypeOf: Re } = Object, { iterator: ce, toStringTag: Xe } = Symbol, le = /* @__PURE__ */ ((e) => (t) => {
  const n = Ot.call(t);
  return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), L = (e) => (e = e.toLowerCase(), (t) => le(t) === e), ue = (e) => (t) => typeof t === e, { isArray: K } = Array, V = ue("undefined");
function Q(e) {
  return e !== null && !V(e) && e.constructor !== null && !V(e.constructor) && N(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const Ge = L("ArrayBuffer");
function At(e) {
  let t;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && Ge(e.buffer), t;
}
const Tt = ue("string"), N = ue("function"), Qe = ue("number"), Z = (e) => e !== null && typeof e == "object", Ct = (e) => e === !0 || e === !1, se = (e) => {
  if (le(e) !== "object")
    return !1;
  const t = Re(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Xe in e) && !(ce in e);
}, _t = (e) => {
  if (!Z(e) || Q(e))
    return !1;
  try {
    return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype;
  } catch {
    return !1;
  }
}, xt = L("Date"), Nt = L("File"), Ut = L("Blob"), Pt = L("FileList"), Ft = (e) => Z(e) && N(e.pipe), Lt = (e) => {
  let t;
  return e && (typeof FormData == "function" && e instanceof FormData || N(e.append) && ((t = le(e)) === "formdata" || // detect form-data instance
  t === "object" && N(e.toString) && e.toString() === "[object FormData]"));
}, Dt = L("URLSearchParams"), [It, kt, Bt, jt] = ["ReadableStream", "Request", "Response", "Headers"].map(L), qt = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Y(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let r, s;
  if (typeof e != "object" && (e = [e]), K(e))
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
function Ze(e, t) {
  if (Q(e))
    return null;
  t = t.toLowerCase();
  const n = Object.keys(e);
  let r = n.length, s;
  for (; r-- > 0; )
    if (s = n[r], t === s.toLowerCase())
      return s;
  return null;
}
const M = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, Ye = (e) => !V(e) && e !== M;
function ye() {
  const { caseless: e, skipUndefined: t } = Ye(this) && this || {}, n = {}, r = (s, i) => {
    const o = e && Ze(n, i) || i;
    se(n[o]) && se(s) ? n[o] = ye(n[o], s) : se(s) ? n[o] = ye({}, s) : K(s) ? n[o] = s.slice() : (!t || !V(s)) && (n[o] = s);
  };
  for (let s = 0, i = arguments.length; s < i; s++)
    arguments[s] && Y(arguments[s], r);
  return n;
}
const Ht = (e, t, n, { allOwnKeys: r } = {}) => (Y(t, (s, i) => {
  n && N(s) ? e[i] = Ke(s, n) : e[i] = s;
}, { allOwnKeys: r }), e), $t = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), Mt = (e, t, n, r) => {
  e.prototype = Object.create(t.prototype, r), e.prototype.constructor = e, Object.defineProperty(e, "super", {
    value: t.prototype
  }), n && Object.assign(e.prototype, n);
}, zt = (e, t, n, r) => {
  let s, i, o;
  const c = {};
  if (t = t || {}, e == null) return t;
  do {
    for (s = Object.getOwnPropertyNames(e), i = s.length; i-- > 0; )
      o = s[i], (!r || r(o, e, t)) && !c[o] && (t[o] = e[o], c[o] = !0);
    e = n !== !1 && Re(e);
  } while (e && (!n || n(e, t)) && e !== Object.prototype);
  return t;
}, vt = (e, t, n) => {
  e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
  const r = e.indexOf(t, n);
  return r !== -1 && r === n;
}, Wt = (e) => {
  if (!e) return null;
  if (K(e)) return e;
  let t = e.length;
  if (!Qe(t)) return null;
  const n = new Array(t);
  for (; t-- > 0; )
    n[t] = e[t];
  return n;
}, Jt = /* @__PURE__ */ ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && Re(Uint8Array)), Vt = (e, t) => {
  const r = (e && e[ce]).call(e);
  let s;
  for (; (s = r.next()) && !s.done; ) {
    const i = s.value;
    t.call(e, i[0], i[1]);
  }
}, Kt = (e, t) => {
  let n;
  const r = [];
  for (; (n = e.exec(t)) !== null; )
    r.push(n);
  return r;
}, Xt = L("HTMLFormElement"), Gt = (e) => e.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(n, r, s) {
    return r.toUpperCase() + s;
  }
), Ue = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), Qt = L("RegExp"), et = (e, t) => {
  const n = Object.getOwnPropertyDescriptors(e), r = {};
  Y(n, (s, i) => {
    let o;
    (o = t(s, i, e)) !== !1 && (r[i] = o || s);
  }), Object.defineProperties(e, r);
}, Zt = (e) => {
  et(e, (t, n) => {
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
}, Yt = (e, t) => {
  const n = {}, r = (s) => {
    s.forEach((i) => {
      n[i] = !0;
    });
  };
  return K(e) ? r(e) : r(String(e).split(t)), n;
}, en = () => {
}, tn = (e, t) => e != null && Number.isFinite(e = +e) ? e : t;
function nn(e) {
  return !!(e && N(e.append) && e[Xe] === "FormData" && e[ce]);
}
const rn = (e) => {
  const t = new Array(10), n = (r, s) => {
    if (Z(r)) {
      if (t.indexOf(r) >= 0)
        return;
      if (Q(r))
        return r;
      if (!("toJSON" in r)) {
        t[s] = r;
        const i = K(r) ? [] : {};
        return Y(r, (o, c) => {
          const d = n(o, s + 1);
          !V(d) && (i[c] = d);
        }), t[s] = void 0, i;
      }
    }
    return r;
  };
  return n(e, 0);
}, sn = L("AsyncFunction"), on = (e) => e && (Z(e) || N(e)) && N(e.then) && N(e.catch), tt = ((e, t) => e ? setImmediate : t ? ((n, r) => (M.addEventListener("message", ({ source: s, data: i }) => {
  s === M && i === n && r.length && r.shift()();
}, !1), (s) => {
  r.push(s), M.postMessage(n, "*");
}))(`axios@${Math.random()}`, []) : (n) => setTimeout(n))(
  typeof setImmediate == "function",
  N(M.postMessage)
), an = typeof queueMicrotask < "u" ? queueMicrotask.bind(M) : typeof process < "u" && process.nextTick || tt, cn = (e) => e != null && N(e[ce]), a = {
  isArray: K,
  isArrayBuffer: Ge,
  isBuffer: Q,
  isFormData: Lt,
  isArrayBufferView: At,
  isString: Tt,
  isNumber: Qe,
  isBoolean: Ct,
  isObject: Z,
  isPlainObject: se,
  isEmptyObject: _t,
  isReadableStream: It,
  isRequest: kt,
  isResponse: Bt,
  isHeaders: jt,
  isUndefined: V,
  isDate: xt,
  isFile: Nt,
  isBlob: Ut,
  isRegExp: Qt,
  isFunction: N,
  isStream: Ft,
  isURLSearchParams: Dt,
  isTypedArray: Jt,
  isFileList: Pt,
  forEach: Y,
  merge: ye,
  extend: Ht,
  trim: qt,
  stripBOM: $t,
  inherits: Mt,
  toFlatObject: zt,
  kindOf: le,
  kindOfTest: L,
  endsWith: vt,
  toArray: Wt,
  forEachEntry: Vt,
  matchAll: Kt,
  isHTMLForm: Xt,
  hasOwnProperty: Ue,
  hasOwnProp: Ue,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: et,
  freezeMethods: Zt,
  toObjectSet: Yt,
  toCamelCase: Gt,
  noop: en,
  toFiniteNumber: tn,
  findKey: Ze,
  global: M,
  isContextDefined: Ye,
  isSpecCompliantForm: nn,
  toJSONObject: rn,
  isAsyncFn: sn,
  isThenable: on,
  setImmediate: tt,
  asap: an,
  isIterable: cn
};
function w(e, t, n, r, s) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = "AxiosError", t && (this.code = t), n && (this.config = n), r && (this.request = r), s && (this.response = s, this.status = s.status ? s.status : null);
}
a.inherits(w, Error, {
  toJSON: function() {
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
const nt = w.prototype, rt = {};
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
  rt[e] = { value: e };
});
Object.defineProperties(w, rt);
Object.defineProperty(nt, "isAxiosError", { value: !0 });
w.from = (e, t, n, r, s, i) => {
  const o = Object.create(nt);
  a.toFlatObject(e, o, function(l) {
    return l !== Error.prototype;
  }, (f) => f !== "isAxiosError");
  const c = e && e.message ? e.message : "Error", d = t == null && e ? e.code : t;
  return w.call(o, c, d, n, r, s), e && o.cause == null && Object.defineProperty(o, "cause", { value: e, configurable: !0 }), o.name = e && e.name || "Error", i && Object.assign(o, i), o;
};
const ln = null;
function be(e) {
  return a.isPlainObject(e) || a.isArray(e);
}
function st(e) {
  return a.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function Pe(e, t, n) {
  return e ? e.concat(t).map(function(s, i) {
    return s = st(s), !n && i ? "[" + s + "]" : s;
  }).join(n ? "." : "") : t;
}
function un(e) {
  return a.isArray(e) && !e.some(be);
}
const fn = a.toFlatObject(a, {}, null, function(t) {
  return /^is[A-Z]/.test(t);
});
function fe(e, t, n) {
  if (!a.isObject(e))
    throw new TypeError("target must be an object");
  t = t || new FormData(), n = a.toFlatObject(n, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(m, p) {
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
      throw new w("Blob is not supported. Use a Buffer instead.");
    return a.isArrayBuffer(u) || a.isTypedArray(u) ? d && typeof Blob == "function" ? new Blob([u]) : Buffer.from(u) : u;
  }
  function l(u, m, p) {
    let O = u;
    if (u && !p && typeof u == "object") {
      if (a.endsWith(m, "{}"))
        m = r ? m : m.slice(0, -2), u = JSON.stringify(u);
      else if (a.isArray(u) && un(u) || (a.isFileList(u) || a.endsWith(m, "[]")) && (O = a.toArray(u)))
        return m = st(m), O.forEach(function(S, _) {
          !(a.isUndefined(S) || S === null) && t.append(
            // eslint-disable-next-line no-nested-ternary
            o === !0 ? Pe([m], _, i) : o === null ? m : m + "[]",
            f(S)
          );
        }), !1;
    }
    return be(u) ? !0 : (t.append(Pe(p, m, i), f(u)), !1);
  }
  const h = [], b = Object.assign(fn, {
    defaultVisitor: l,
    convertValue: f,
    isVisitable: be
  });
  function A(u, m) {
    if (!a.isUndefined(u)) {
      if (h.indexOf(u) !== -1)
        throw Error("Circular reference detected in " + m.join("."));
      h.push(u), a.forEach(u, function(O, T) {
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
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function(r) {
    return t[r];
  });
}
function Oe(e, t) {
  this._pairs = [], e && fe(e, this, t);
}
const ot = Oe.prototype;
ot.append = function(t, n) {
  this._pairs.push([t, n]);
};
ot.toString = function(t) {
  const n = t ? function(r) {
    return t.call(this, r, Fe);
  } : Fe;
  return this._pairs.map(function(s) {
    return n(s[0]) + "=" + n(s[1]);
  }, "").join("&");
};
function dn(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function it(e, t, n) {
  if (!t)
    return e;
  const r = n && n.encode || dn;
  a.isFunction(n) && (n = {
    serialize: n
  });
  const s = n && n.serialize;
  let i;
  if (s ? i = s(t, n) : i = a.isURLSearchParams(t) ? t.toString() : new Oe(t, n).toString(r), i) {
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
    a.forEach(this.handlers, function(r) {
      r !== null && t(r);
    });
  }
}
const at = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, pn = typeof URLSearchParams < "u" ? URLSearchParams : Oe, hn = typeof FormData < "u" ? FormData : null, mn = typeof Blob < "u" ? Blob : null, wn = {
  isBrowser: !0,
  classes: {
    URLSearchParams: pn,
    FormData: hn,
    Blob: mn
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, Ae = typeof window < "u" && typeof document < "u", Ee = typeof navigator == "object" && navigator || void 0, gn = Ae && (!Ee || ["ReactNative", "NativeScript", "NS"].indexOf(Ee.product) < 0), yn = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", bn = Ae && window.location.href || "http://localhost", En = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: Ae,
  hasStandardBrowserEnv: gn,
  hasStandardBrowserWebWorkerEnv: yn,
  navigator: Ee,
  origin: bn
}, Symbol.toStringTag, { value: "Module" })), x = {
  ...En,
  ...wn
};
function Sn(e, t) {
  return fe(e, new x.classes.URLSearchParams(), {
    visitor: function(n, r, s, i) {
      return x.isNode && a.isBuffer(n) ? (this.append(r, n.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments);
    },
    ...t
  });
}
function Rn(e) {
  return a.matchAll(/\w+|\[(\w*)]/g, e).map((t) => t[0] === "[]" ? "" : t[1] || t[0]);
}
function On(e) {
  const t = {}, n = Object.keys(e);
  let r;
  const s = n.length;
  let i;
  for (r = 0; r < s; r++)
    i = n[r], t[i] = e[i];
  return t;
}
function ct(e) {
  function t(n, r, s, i) {
    let o = n[i++];
    if (o === "__proto__") return !0;
    const c = Number.isFinite(+o), d = i >= n.length;
    return o = !o && a.isArray(s) ? s.length : o, d ? (a.hasOwnProp(s, o) ? s[o] = [s[o], r] : s[o] = r, !c) : ((!s[o] || !a.isObject(s[o])) && (s[o] = []), t(n, r, s[o], i) && a.isArray(s[o]) && (s[o] = On(s[o])), !c);
  }
  if (a.isFormData(e) && a.isFunction(e.entries)) {
    const n = {};
    return a.forEachEntry(e, (r, s) => {
      t(Rn(r), s, n, 0);
    }), n;
  }
  return null;
}
function An(e, t, n) {
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
  transitional: at,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(t, n) {
    const r = n.getContentType() || "", s = r.indexOf("application/json") > -1, i = a.isObject(t);
    if (i && a.isHTMLForm(t) && (t = new FormData(t)), a.isFormData(t))
      return s ? JSON.stringify(ct(t)) : t;
    if (a.isArrayBuffer(t) || a.isBuffer(t) || a.isStream(t) || a.isFile(t) || a.isBlob(t) || a.isReadableStream(t))
      return t;
    if (a.isArrayBufferView(t))
      return t.buffer;
    if (a.isURLSearchParams(t))
      return n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
    let c;
    if (i) {
      if (r.indexOf("application/x-www-form-urlencoded") > -1)
        return Sn(t, this.formSerializer).toString();
      if ((c = a.isFileList(t)) || r.indexOf("multipart/form-data") > -1) {
        const d = this.env && this.env.FormData;
        return fe(
          c ? { "files[]": t } : t,
          d && new d(),
          this.formSerializer
        );
      }
    }
    return i || s ? (n.setContentType("application/json", !1), An(t)) : t;
  }],
  transformResponse: [function(t) {
    const n = this.transitional || ee.transitional, r = n && n.forcedJSONParsing, s = this.responseType === "json";
    if (a.isResponse(t) || a.isReadableStream(t))
      return t;
    if (t && a.isString(t) && (r && !this.responseType || s)) {
      const o = !(n && n.silentJSONParsing) && s;
      try {
        return JSON.parse(t, this.parseReviver);
      } catch (c) {
        if (o)
          throw c.name === "SyntaxError" ? w.from(c, w.ERR_BAD_RESPONSE, this, null, this.response) : c;
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
    FormData: x.classes.FormData,
    Blob: x.classes.Blob
  },
  validateStatus: function(t) {
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
const Tn = a.toObjectSet([
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
]), Cn = (e) => {
  const t = {};
  let n, r, s;
  return e && e.split(`
`).forEach(function(o) {
    s = o.indexOf(":"), n = o.substring(0, s).trim().toLowerCase(), r = o.substring(s + 1).trim(), !(!n || t[n] && Tn[n]) && (n === "set-cookie" ? t[n] ? t[n].push(r) : t[n] = [r] : t[n] = t[n] ? t[n] + ", " + r : r);
  }), t;
}, De = /* @__PURE__ */ Symbol("internals");
function G(e) {
  return e && String(e).trim().toLowerCase();
}
function oe(e) {
  return e === !1 || e == null ? e : a.isArray(e) ? e.map(oe) : String(e);
}
function _n(e) {
  const t = /* @__PURE__ */ Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let r;
  for (; r = n.exec(e); )
    t[r[1]] = r[2];
  return t;
}
const xn = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function me(e, t, n, r, s) {
  if (a.isFunction(r))
    return r.call(this, t, n);
  if (s && (t = n), !!a.isString(t)) {
    if (a.isString(r))
      return t.indexOf(r) !== -1;
    if (a.isRegExp(r))
      return r.test(t);
  }
}
function Nn(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (t, n, r) => n.toUpperCase() + r);
}
function Un(e, t) {
  const n = a.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((r) => {
    Object.defineProperty(e, r + n, {
      value: function(s, i, o) {
        return this[r].call(this, t, s, i, o);
      },
      configurable: !0
    });
  });
}
let U = class {
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
      o(Cn(t), n);
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
          return _n(s);
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
      return !!(r && this[r] !== void 0 && (!n || me(this, this[r], r, n)));
    }
    return !1;
  }
  delete(t, n) {
    const r = this;
    let s = !1;
    function i(o) {
      if (o = G(o), o) {
        const c = a.findKey(r, o);
        c && (!n || me(r, r[c], c, n)) && (delete r[c], s = !0);
      }
    }
    return a.isArray(t) ? t.forEach(i) : i(t), s;
  }
  clear(t) {
    const n = Object.keys(this);
    let r = n.length, s = !1;
    for (; r--; ) {
      const i = n[r];
      (!t || me(this, this[i], i, t, !0)) && (delete this[i], s = !0);
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
      const c = t ? Nn(i) : String(i).trim();
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
      r[c] || (Un(s, o), r[c] = !0);
    }
    return a.isArray(t) ? t.forEach(i) : i(t), this;
  }
};
U.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
a.reduceDescriptors(U.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(r) {
      this[n] = r;
    }
  };
});
a.freezeMethods(U);
function we(e, t) {
  const n = this || ee, r = t || n, s = U.from(r.headers);
  let i = r.data;
  return a.forEach(e, function(c) {
    i = c.call(n, i, s.normalize(), t ? t.status : void 0);
  }), s.normalize(), i;
}
function lt(e) {
  return !!(e && e.__CANCEL__);
}
function X(e, t, n) {
  w.call(this, e ?? "canceled", w.ERR_CANCELED, t, n), this.name = "CanceledError";
}
a.inherits(X, w, {
  __CANCEL__: !0
});
function ut(e, t, n) {
  const r = n.config.validateStatus;
  !n.status || !r || r(n.status) ? e(n) : t(new w(
    "Request failed with status code " + n.status,
    [w.ERR_BAD_REQUEST, w.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4],
    n.config,
    n.request,
    n
  ));
}
function Pn(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return t && t[1] || "";
}
function Fn(e, t) {
  e = e || 10;
  const n = new Array(e), r = new Array(e);
  let s = 0, i = 0, o;
  return t = t !== void 0 ? t : 1e3, function(d) {
    const f = Date.now(), l = r[i];
    o || (o = f), n[s] = d, r[s] = f;
    let h = i, b = 0;
    for (; h !== s; )
      b += n[h++], h = h % e;
    if (s = (s + 1) % e, s === i && (i = (i + 1) % e), f - o < t)
      return;
    const A = l && f - l;
    return A ? Math.round(b * 1e3 / A) : void 0;
  };
}
function Ln(e, t) {
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
  const s = Fn(50, 250);
  return Ln((i) => {
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
}, ke = (e) => (...t) => a.asap(() => e(...t)), Dn = x.hasStandardBrowserEnv ? /* @__PURE__ */ ((e, t) => (n) => (n = new URL(n, x.origin), e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)))(
  new URL(x.origin),
  x.navigator && /(msie|trident)/i.test(x.navigator.userAgent)
) : () => !0, In = x.hasStandardBrowserEnv ? (
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
function kn(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function Bn(e, t) {
  return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function ft(e, t, n) {
  let r = !kn(t);
  return e && (r || n == !1) ? Bn(e, t) : t;
}
const Be = (e) => e instanceof U ? { ...e } : e;
function v(e, t) {
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
  return a.forEach(Object.keys({ ...e, ...t }), function(l) {
    const h = d[l] || s, b = h(e[l], t[l], l);
    a.isUndefined(b) && h !== c || (n[l] = b);
  }), n;
}
const dt = (e) => {
  const t = v({}, e);
  let { data: n, withXSRFToken: r, xsrfHeaderName: s, xsrfCookieName: i, headers: o, auth: c } = t;
  if (t.headers = o = U.from(o), t.url = it(ft(t.baseURL, t.url, t.allowAbsoluteUrls), e.params, e.paramsSerializer), c && o.set(
    "Authorization",
    "Basic " + btoa((c.username || "") + ":" + (c.password ? unescape(encodeURIComponent(c.password)) : ""))
  ), a.isFormData(n)) {
    if (x.hasStandardBrowserEnv || x.hasStandardBrowserWebWorkerEnv)
      o.setContentType(void 0);
    else if (a.isFunction(n.getHeaders)) {
      const d = n.getHeaders(), f = ["content-type", "content-length"];
      Object.entries(d).forEach(([l, h]) => {
        f.includes(l.toLowerCase()) && o.set(l, h);
      });
    }
  }
  if (x.hasStandardBrowserEnv && (r && a.isFunction(r) && (r = r(t)), r || r !== !1 && Dn(t.url))) {
    const d = s && i && In.read(i);
    d && o.set(s, d);
  }
  return t;
}, jn = typeof XMLHttpRequest < "u", qn = jn && function(e) {
  return new Promise(function(n, r) {
    const s = dt(e);
    let i = s.data;
    const o = U.from(s.headers).normalize();
    let { responseType: c, onUploadProgress: d, onDownloadProgress: f } = s, l, h, b, A, u;
    function m() {
      A && A(), u && u(), s.cancelToken && s.cancelToken.unsubscribe(l), s.signal && s.signal.removeEventListener("abort", l);
    }
    let p = new XMLHttpRequest();
    p.open(s.method.toUpperCase(), s.url, !0), p.timeout = s.timeout;
    function O() {
      if (!p)
        return;
      const S = U.from(
        "getAllResponseHeaders" in p && p.getAllResponseHeaders()
      ), P = {
        data: !c || c === "text" || c === "json" ? p.responseText : p.response,
        status: p.status,
        statusText: p.statusText,
        headers: S,
        config: e,
        request: p
      };
      ut(function(y) {
        n(y), m();
      }, function(y) {
        r(y), m();
      }, P), p = null;
    }
    "onloadend" in p ? p.onloadend = O : p.onreadystatechange = function() {
      !p || p.readyState !== 4 || p.status === 0 && !(p.responseURL && p.responseURL.indexOf("file:") === 0) || setTimeout(O);
    }, p.onabort = function() {
      p && (r(new w("Request aborted", w.ECONNABORTED, e, p)), p = null);
    }, p.onerror = function(_) {
      const P = _ && _.message ? _.message : "Network Error", k = new w(P, w.ERR_NETWORK, e, p);
      k.event = _ || null, r(k), p = null;
    }, p.ontimeout = function() {
      let _ = s.timeout ? "timeout of " + s.timeout + "ms exceeded" : "timeout exceeded";
      const P = s.transitional || at;
      s.timeoutErrorMessage && (_ = s.timeoutErrorMessage), r(new w(
        _,
        P.clarifyTimeoutError ? w.ETIMEDOUT : w.ECONNABORTED,
        e,
        p
      )), p = null;
    }, i === void 0 && o.setContentType(null), "setRequestHeader" in p && a.forEach(o.toJSON(), function(_, P) {
      p.setRequestHeader(P, _);
    }), a.isUndefined(s.withCredentials) || (p.withCredentials = !!s.withCredentials), c && c !== "json" && (p.responseType = s.responseType), f && ([b, u] = ae(f, !0), p.addEventListener("progress", b)), d && p.upload && ([h, A] = ae(d), p.upload.addEventListener("progress", h), p.upload.addEventListener("loadend", A)), (s.cancelToken || s.signal) && (l = (S) => {
      p && (r(!S || S.type ? new X(null, e, p) : S), p.abort(), p = null);
    }, s.cancelToken && s.cancelToken.subscribe(l), s.signal && (s.signal.aborted ? l() : s.signal.addEventListener("abort", l)));
    const T = Pn(s.url);
    if (T && x.protocols.indexOf(T) === -1) {
      r(new w("Unsupported protocol " + T + ":", w.ERR_BAD_REQUEST, e));
      return;
    }
    p.send(i || null);
  });
}, Hn = (e, t) => {
  const { length: n } = e = e ? e.filter(Boolean) : [];
  if (t || n) {
    let r = new AbortController(), s;
    const i = function(f) {
      if (!s) {
        s = !0, c();
        const l = f instanceof Error ? f : this.reason;
        r.abort(l instanceof w ? l : new X(l instanceof Error ? l.message : l));
      }
    };
    let o = t && setTimeout(() => {
      o = null, i(new w(`timeout ${t} of ms exceeded`, w.ETIMEDOUT));
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
}, $n = function* (e, t) {
  let n = e.byteLength;
  if (n < t) {
    yield e;
    return;
  }
  let r = 0, s;
  for (; r < n; )
    s = r + t, yield e.slice(r, s), r = s;
}, Mn = async function* (e, t) {
  for await (const n of zn(e))
    yield* $n(n, t);
}, zn = async function* (e) {
  if (e[Symbol.asyncIterator]) {
    yield* e;
    return;
  }
  const t = e.getReader();
  try {
    for (; ; ) {
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
}, qe = 64 * 1024, { isFunction: re } = a, vn = (({ Request: e, Response: t }) => ({
  Request: e,
  Response: t
}))(a.global), {
  ReadableStream: He,
  TextEncoder: $e
} = a.global, Me = (e, ...t) => {
  try {
    return !!e(...t);
  } catch {
    return !1;
  }
}, Wn = (e) => {
  e = a.merge.call({
    skipUndefined: !0
  }, vn, e);
  const { fetch: t, Request: n, Response: r } = e, s = t ? re(t) : typeof fetch == "function", i = re(n), o = re(r);
  if (!s)
    return !1;
  const c = s && re(He), d = s && (typeof $e == "function" ? /* @__PURE__ */ ((u) => (m) => u.encode(m))(new $e()) : async (u) => new Uint8Array(await new n(u).arrayBuffer())), f = i && c && Me(() => {
    let u = !1;
    const m = new n(x.origin, {
      body: new He(),
      method: "POST",
      get duplex() {
        return u = !0, "half";
      }
    }).headers.has("Content-Type");
    return u && !m;
  }), l = o && c && Me(() => a.isReadableStream(new r("").body)), h = {
    stream: l && ((u) => u.body)
  };
  s && ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((u) => {
    !h[u] && (h[u] = (m, p) => {
      let O = m && m[u];
      if (O)
        return O.call(m);
      throw new w(`Response type '${u}' is not supported`, w.ERR_NOT_SUPPORT, p);
    });
  });
  const b = async (u) => {
    if (u == null)
      return 0;
    if (a.isBlob(u))
      return u.size;
    if (a.isSpecCompliantForm(u))
      return (await new n(x.origin, {
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
      timeout: _,
      onDownloadProgress: P,
      onUploadProgress: k,
      responseType: y,
      headers: E,
      withCredentials: g = "same-origin",
      fetchOptions: C
    } = dt(u), F = t || fetch;
    y = y ? (y + "").toLowerCase() : "text";
    let j = Hn([T, S && S.toAbortSignal()], _), B = null;
    const $ = j && j.unsubscribe && (() => {
      j.unsubscribe();
    });
    let Ce;
    try {
      if (k && f && p !== "get" && p !== "head" && (Ce = await A(E, O)) !== 0) {
        let H = new n(m, {
          method: "POST",
          body: O,
          duplex: "half"
        }), W;
        if (a.isFormData(O) && (W = H.headers.get("content-type")) && E.setContentType(W), H.body) {
          const [pe, te] = Ie(
            Ce,
            ae(ke(k))
          );
          O = je(H.body, qe, pe, te);
        }
      }
      a.isString(g) || (g = g ? "include" : "omit");
      const D = i && "credentials" in n.prototype, _e = {
        ...C,
        signal: j,
        method: p.toUpperCase(),
        headers: E.normalize().toJSON(),
        body: O,
        duplex: "half",
        credentials: D ? g : void 0
      };
      B = i && new n(m, _e);
      let q = await (i ? F(B, C) : F(m, _e));
      const xe = l && (y === "stream" || y === "response");
      if (l && (P || xe && $)) {
        const H = {};
        ["status", "statusText", "headers"].forEach((Ne) => {
          H[Ne] = q[Ne];
        });
        const W = a.toFiniteNumber(q.headers.get("content-length")), [pe, te] = P && Ie(
          W,
          ae(ke(P), !0)
        ) || [];
        q = new r(
          je(q.body, qe, pe, () => {
            te && te(), $ && $();
          }),
          H
        );
      }
      y = y || "text";
      let bt = await h[a.findKey(h, y) || "text"](q, u);
      return !xe && $ && $(), await new Promise((H, W) => {
        ut(H, W, {
          data: bt,
          headers: U.from(q.headers),
          status: q.status,
          statusText: q.statusText,
          config: u,
          request: B
        });
      });
    } catch (D) {
      throw $ && $(), D && D.name === "TypeError" && /Load failed|fetch/i.test(D.message) ? Object.assign(
        new w("Network Error", w.ERR_NETWORK, u, B),
        {
          cause: D.cause || D
        }
      ) : w.from(D, D && D.code, u, B);
    }
  };
}, Jn = /* @__PURE__ */ new Map(), pt = (e) => {
  let t = e && e.env || {};
  const { fetch: n, Request: r, Response: s } = t, i = [
    r,
    s,
    n
  ];
  let o = i.length, c = o, d, f, l = Jn;
  for (; c--; )
    d = i[c], f = l.get(d), f === void 0 && l.set(d, f = c ? /* @__PURE__ */ new Map() : Wn(t)), l = f;
  return f;
};
pt();
const Te = {
  http: ln,
  xhr: qn,
  fetch: {
    get: pt
  }
};
a.forEach(Te, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const ze = (e) => `- ${e}`, Vn = (e) => a.isFunction(e) || e === null || e === !1;
function Kn(e, t) {
  e = a.isArray(e) ? e : [e];
  const { length: n } = e;
  let r, s;
  const i = {};
  for (let o = 0; o < n; o++) {
    r = e[o];
    let c;
    if (s = r, !Vn(r) && (s = Te[(c = String(r)).toLowerCase()], s === void 0))
      throw new w(`Unknown adapter '${c}'`);
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
    throw new w(
      "There is no suitable adapter to dispatch the request " + c,
      "ERR_NOT_SUPPORT"
    );
  }
  return s;
}
const ht = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter: Kn,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: Te
};
function ge(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new X(null, e);
}
function ve(e) {
  return ge(e), e.headers = U.from(e.headers), e.data = we.call(
    e,
    e.transformRequest
  ), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), ht.getAdapter(e.adapter || ee.adapter, e)(e).then(function(r) {
    return ge(e), r.data = we.call(
      e,
      e.transformResponse,
      r
    ), r.headers = U.from(r.headers), r;
  }, function(r) {
    return lt(r) || (ge(e), r && r.response && (r.response.data = we.call(
      e,
      e.transformResponse,
      r.response
    ), r.response.headers = U.from(r.response.headers))), Promise.reject(r);
  });
}
const mt = "1.13.2", de = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  de[e] = function(r) {
    return typeof r === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const We = {};
de.transitional = function(t, n, r) {
  function s(i, o) {
    return "[Axios v" + mt + "] Transitional option '" + i + "'" + o + (r ? ". " + r : "");
  }
  return (i, o, c) => {
    if (t === !1)
      throw new w(
        s(o, " has been removed" + (n ? " in " + n : "")),
        w.ERR_DEPRECATED
      );
    return n && !We[o] && (We[o] = !0, console.warn(
      s(
        o,
        " has been deprecated since v" + n + " and will be removed in the near future"
      )
    )), t ? t(i, o, c) : !0;
  };
};
de.spelling = function(t) {
  return (n, r) => (console.warn(`${r} is likely a misspelling of ${t}`), !0);
};
function Xn(e, t, n) {
  if (typeof e != "object")
    throw new w("options must be an object", w.ERR_BAD_OPTION_VALUE);
  const r = Object.keys(e);
  let s = r.length;
  for (; s-- > 0; ) {
    const i = r[s], o = t[i];
    if (o) {
      const c = e[i], d = c === void 0 || o(c, i, e);
      if (d !== !0)
        throw new w("option " + i + " must be " + d, w.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (n !== !0)
      throw new w("Unknown option " + i, w.ERR_BAD_OPTION);
  }
}
const ie = {
  assertOptions: Xn,
  validators: de
}, I = ie.validators;
let z = class {
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
    typeof t == "string" ? (n = n || {}, n.url = t) : n = t || {}, n = v(this.defaults, n);
    const { transitional: r, paramsSerializer: s, headers: i } = n;
    r !== void 0 && ie.assertOptions(r, {
      silentJSONParsing: I.transitional(I.boolean),
      forcedJSONParsing: I.transitional(I.boolean),
      clarifyTimeoutError: I.transitional(I.boolean)
    }, !1), s != null && (a.isFunction(s) ? n.paramsSerializer = {
      serialize: s
    } : ie.assertOptions(s, {
      encode: I.function,
      serialize: I.function
    }, !0)), n.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? n.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : n.allowAbsoluteUrls = !0), ie.assertOptions(n, {
      baseUrl: I.spelling("baseURL"),
      withXsrfToken: I.spelling("withXSRFToken")
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
    ), n.headers = U.concat(o, i);
    const c = [];
    let d = !0;
    this.interceptors.request.forEach(function(m) {
      typeof m.runWhen == "function" && m.runWhen(n) === !1 || (d = d && m.synchronous, c.unshift(m.fulfilled, m.rejected));
    });
    const f = [];
    this.interceptors.response.forEach(function(m) {
      f.push(m.fulfilled, m.rejected);
    });
    let l, h = 0, b;
    if (!d) {
      const u = [ve.bind(this), void 0];
      for (u.unshift(...c), u.push(...f), b = u.length, l = Promise.resolve(n); h < b; )
        l = l.then(u[h++], u[h++]);
      return l;
    }
    b = c.length;
    let A = n;
    for (; h < b; ) {
      const u = c[h++], m = c[h++];
      try {
        A = u(A);
      } catch (p) {
        m.call(this, p);
        break;
      }
    }
    try {
      l = ve.call(this, A);
    } catch (u) {
      return Promise.reject(u);
    }
    for (h = 0, b = f.length; h < b; )
      l = l.then(f[h++], f[h++]);
    return l;
  }
  getUri(t) {
    t = v(this.defaults, t);
    const n = ft(t.baseURL, t.url, t.allowAbsoluteUrls);
    return it(n, t.params, t.paramsSerializer);
  }
};
a.forEach(["delete", "get", "head", "options"], function(t) {
  z.prototype[t] = function(n, r) {
    return this.request(v(r || {}, {
      method: t,
      url: n,
      data: (r || {}).data
    }));
  };
});
a.forEach(["post", "put", "patch"], function(t) {
  function n(r) {
    return function(i, o, c) {
      return this.request(v(c || {}, {
        method: t,
        headers: r ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: i,
        data: o
      }));
    };
  }
  z.prototype[t] = n(), z.prototype[t + "Form"] = n(!0);
});
let Gn = class wt {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let n;
    this.promise = new Promise(function(i) {
      n = i;
    });
    const r = this;
    this.promise.then((s) => {
      if (!r._listeners) return;
      let i = r._listeners.length;
      for (; i-- > 0; )
        r._listeners[i](s);
      r._listeners = null;
    }), this.promise.then = (s) => {
      let i;
      const o = new Promise((c) => {
        r.subscribe(c), i = c;
      }).then(s);
      return o.cancel = function() {
        r.unsubscribe(i);
      }, o;
    }, t(function(i, o, c) {
      r.reason || (r.reason = new X(i, o, c), n(r.reason));
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
      token: new wt(function(s) {
        t = s;
      }),
      cancel: t
    };
  }
};
function Qn(e) {
  return function(n) {
    return e.apply(null, n);
  };
}
function Zn(e) {
  return a.isObject(e) && e.isAxiosError === !0;
}
const Se = {
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
Object.entries(Se).forEach(([e, t]) => {
  Se[t] = e;
});
function gt(e) {
  const t = new z(e), n = Ke(z.prototype.request, t);
  return a.extend(n, z.prototype, t, { allOwnKeys: !0 }), a.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(s) {
    return gt(v(e, s));
  }, n;
}
const R = gt(ee);
R.Axios = z;
R.CanceledError = X;
R.CancelToken = Gn;
R.isCancel = lt;
R.VERSION = mt;
R.toFormData = fe;
R.AxiosError = w;
R.Cancel = R.CanceledError;
R.all = function(t) {
  return Promise.all(t);
};
R.spread = Qn;
R.isAxiosError = Zn;
R.mergeConfig = v;
R.AxiosHeaders = U;
R.formToJSON = (e) => ct(a.isHTMLForm(e) ? new FormData(e) : e);
R.getAdapter = ht.getAdapter;
R.HttpStatusCode = Se;
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
  AxiosHeaders: wr,
  HttpStatusCode: gr,
  formToJSON: yr,
  getAdapter: br,
  mergeConfig: Er
} = R, yt = R.create({
  baseURL: "https://aurastage.unthink.ai"
}), Je = async (e) => {
  try {
    const t = e.trim().toLowerCase(), n = await yt.get(`/users/get_user_info/?emailId=${t}`);
    return n.data.status === "success" ? n.data.data : null;
  } catch (t) {
    return console.error("Get user info error:", t), null;
  }
}, Yn = async (e) => {
  try {
    const t = await yt.post("/users/save_user_info/", e);
    if (t.data.status === "success")
      return t.data.data;
    throw new Error(t.data.message || "Failed to save user info");
  } catch (t) {
    throw console.error("Save user info error:", t), new Error("Failed to save user info. Please try again.");
  }
};
class Ve {
  constructor(t) {
    this.merchantId = t.merchantId, this.environment = t.environment, this.apiBaseUrl = t.apiBaseUrl || "https://unthink-dropp-payment-stage-314035436999.us-central1.run.app";
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
    ledgerId: r = Rt.TESTNET,
    projectId: s = "31267a2a9ddb2185483abcf7d3dc4903",
    networks: i = [Et.Testnet],
    apiBaseUrl: o = "https://unthink-dropp-payment-stage-314035436999.us-central1.run.app"
  } = e, [c, d] = J(!1), [f, l] = J(null), [h, b] = J(null), [A, u] = J(!0), [m, p] = J(""), [O, T] = J(!1);
  he(() => {
    (async () => {
      try {
        const E = {
          name: "VTO App",
          description: "Virtual Try-On Application",
          icons: ["https://walletconnect.com/walletconnect-logo.png"],
          url: window.location.origin
        }, g = new St(
          E,
          r,
          s,
          i
        );
        if (await g.init(), b(g), console.log("Full Connector Object:", g), console.log("Signers:", g.signers), g.signers && g.signers.length > 0) {
          const C = g.signers[0].getAccountId().toString();
          l(C), d(!0), console.log("Wallet ID:", C);
        }
      } catch (E) {
        console.error("Failed to initialize DAppConnector:", E);
      } finally {
        u(!1);
      }
    })();
  }, []), he(() => {
    (async () => {
      const E = sessionStorage.getItem("dropp_login_trigger"), g = sessionStorage.getItem("dropp_login_email");
      if (E === "true" && g) {
        sessionStorage.removeItem("dropp_login_trigger"), sessionStorage.removeItem("dropp_login_email");
        const C = new Ve({
          merchantId: t,
          environment: n,
          apiBaseUrl: o
        }), F = {
          redirectUrl: window.location.href,
          purpose: "login",
          email: g
        };
        try {
          await C.login(F);
        } catch (j) {
          console.error("Login redirect failed:", j);
        }
      }
    })();
  }, [t, n, o]);
  const S = ne(async (y, E) => {
    try {
      if (!y) {
        console.warn("User email not provided");
        return;
      }
      const g = await Je(y);
      if (!g) {
        console.error("Could not fetch user info");
        return;
      }
      const C = {
        emailId: g.emailId || y,
        user_name: g.user_name || g.first_name,
        user_id: g.user_id,
        is_influencer: g.is_influencer || !1,
        _id: g._id,
        dropp: {
          testnet: {
            merchantAccount: E,
            currency: "USD",
            hedera_details: {}
          },
          mainnet: {}
        }
      };
      await Yn(C), console.log("Wallet info saved successfully for account:", E), p("✓ Wallet info saved successfully!");
    } catch (g) {
      console.error("Failed to save wallet info:", g), p(`✗ Failed to save wallet info: ${g.message}`);
    }
  }, []), _ = ne(async (y) => {
    if (!y) {
      p("⚠️ Please enter an email address first");
      return;
    }
    T(!0), p("Checking user info...");
    try {
      const g = (await Je(y))?.dropp?.testnet?.merchantAccount;
      if (g)
        return l(g), d(!0), p(`✓ Wallet already connected: ${g}`), T(!1), g;
      if (!h)
        throw new Error("DAppConnector not initialized");
      const C = await h.openModal();
      if (C) {
        const F = C.namespaces?.hedera?.accounts || [];
        if (F.length > 0) {
          const B = F[0].split(":").pop();
          return l(B), d(!0), p("Saving wallet info..."), await S(y, B), T(!1), B;
        }
      }
    } catch (E) {
      console.error("Wallet connection failed:", E), p(`✗ Error: ${E.message}`), T(!1);
    }
  }, [h, S]), P = ne(async (y, E = !1) => {
    if (!y) {
      p("⚠️ Please enter an email address first");
      return;
    }
    localStorage.setItem("dropp_pending_email", y);
    const g = new Ve({
      merchantId: t,
      environment: n,
      apiBaseUrl: o
    }), C = {
      redirectUrl: window.location.href,
      // Return to this page
      purpose: "login",
      email: y
    };
    try {
      if (E) {
        const F = `
                    <script>
                        const dropp = new window.Dropp({
                            merchantId: '${t}',
                            environment: '${n}',
                            apiBaseUrl: '${o}'
                        });
                        
                        dropp.login({
                            redirectUrl: window.location.href,
                            purpose: 'login',
                            email: '${y}'
                        }).catch(error => {
                            console.error('Login failed:', error);
                        });
                    <\/script>
                `;
        sessionStorage.setItem("dropp_login_email", y), sessionStorage.setItem("dropp_login_trigger", "true");
        const j = window.open(window.location.href, "_blank");
      } else
        await g.login(C);
    } catch (F) {
      console.error("Login redirect failed:", F), p(`✗ Login failed: ${F.message}`);
    }
  }, [t, n, o]), k = ne(async () => {
    if (h)
      try {
        await h.disconnectAll(), Object.keys(localStorage).filter((E) => E.startsWith("wc@2")).forEach((E) => localStorage.removeItem(E)), l(null), d(!1), p("Wallet disconnected");
      } catch (y) {
        console.error("Wallet disconnect failed:", y), l(null), d(!1);
      }
  }, [h]);
  return he(() => {
    (async () => {
      const E = new URLSearchParams(window.location.search), g = E.get("account_id") || E.get("merchant_id") || E.get("id"), C = localStorage.getItem("dropp_pending_email");
      if (g && !c) {
        console.log("Found account ID in URL params:", g), l(g), d(!0), C && (await S(C, g), localStorage.removeItem("dropp_pending_email"));
        const F = window.location.pathname;
        window.history.replaceState({}, document.title, F);
      }
    })();
  }, [c, S]), {
    isConnected: c,
    walletId: f,
    isInitializing: A,
    statusMessage: m,
    isLoading: O,
    connectWallet: _,
    disconnectWallet: k,
    loginWithEmail: P
  };
};
export {
  Ve as Dropp,
  Je as getFullUserInfo,
  Yn as saveUserInfo,
  Sr as useDroppWallet
};