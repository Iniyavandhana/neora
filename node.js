!function(e) {
    var n = {};
    function __webpack_require__(t) {
        if (n[t])
            return n[t].exports;
        var r = n[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return e[t].call(r.exports, r, r.exports, __webpack_require__),
        r.l = !0,
        r.exports
    }
    __webpack_require__.m = e,
    __webpack_require__.c = n,
    __webpack_require__.d = function(e, n, t) {
        __webpack_require__.o(e, n) || Object.defineProperty(e, n, {
            enumerable: !0,
            get: t
        })
    }
    ,
    __webpack_require__.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    __webpack_require__.t = function(e, n) {
        if (1 & n && (e = __webpack_require__(e)),
        8 & n)
            return e;
        if (4 & n && "object" == typeof e && e && e.__esModule)
            return e;
        var t = Object.create(null);
        if (__webpack_require__.r(t),
        Object.defineProperty(t, "default", {
            enumerable: !0,
            value: e
        }),
        2 & n && "string" != typeof e)
            for (var r in e)
                __webpack_require__.d(t, r, function(n) {
                    return e[n]
                }
                .bind(null, r));
        return t
    }
    ,
    __webpack_require__.n = function(e) {
        var n = e && e.__esModule ? function getDefault() {
            return e.default
        }
        : function getModuleExports() {
            return e
        }
        ;
        return __webpack_require__.d(n, "a", n),
        n
    }
    ,
    __webpack_require__.o = function(e, n) {
        return Object.prototype.hasOwnProperty.call(e, n)
    }
    ,
    __webpack_require__.p = "",
    __webpack_require__(__webpack_require__.s = 0)
}([function(e, n, t) {
    window.AF.plugins.PBA = function() {
        var e = "afUserId"
          , n = "measurementStatus"
          , r = "AF_MEASUREMENT_STATUS"
          , o = "AF_DEFAULT_MEASUREMENT_STATUS"
          , i = !1
          , a = !0
          , u = 4e3;
        function setMeasurementStatus(e, n) {
            try {
                return new Promise(function(t) {
                    return window.AF_SDK.PLUGINS.PBA.coverDomain ? (window.AF_SDK.utils.cookie.set(e, n.toString(), {
                        expires: window.AF_SDK.utils.dateUtil().addYears(2),
                        path: "/",
                        domain: window.AF_SDK.PLUGINS.PBA.coverDomain
                    }),
                    t()) : window.AF_SDK.xhr({
                        url: "https://wa.appsflyer.com/coverdomain?site-id=" + getWebAppId(),
                        body: {
                            domain: window.location.origin
                        },
                        method: "POST",
                        cb: function(r) {
                            window.AF_SDK.PLUGINS.PBA.coverDomain = r.data.domain,
                            window.AF_SDK.utils.cookie.set(e, n.toString(), {
                                expires: window.AF_SDK.utils.dateUtil().addYears(2),
                                path: "/",
                                domain: window.AF_SDK.PLUGINS.PBA.coverDomain
                            }),
                            t()
                        }
                    })
                }
                )
            } catch (e) {
                return window.AF_SDK.utils.logger("Error occur in setMeasurementStatus function (main catch) after ", e)
            }
        }
        function setWebAppIdQueryParam() {
            if (!window.AF_SDK.PLUGINS.PBA.url.includes("site-id")) {
                var e = getWebAppId();
                e && (window.AF_SDK.PLUGINS.PBA.url += "?site-id=" + e)
            }
        }
        function setAfUserIdCookie(n) {
            return window.AF_SDK.utils.cookie.set(e, n, {
                expires: window.AF_SDK.utils.dateUtil().addYears(2),
                path: "/",
                domain: window.AF_SDK.PLUGINS.PBA.coverDomain
            })
        }
        function setAfUserId() {
            if (window.AF_SDK && !window.AF_SDK.utils.cookie.get(e) && window.AF_SDK.PLUGINS.PBA.afWebUserId)
                return setAfUserIdCookie(window.AF_SDK.PLUGINS.PBA.afWebUserId)
        }
        function waHandlerRequest(e, n) {
            !function prepareHandlerRequest(e) {
                var n = getAfWebUserId();
                n && (e.data.afWebUserId = n);
                var t = getAfUserIds();
                t && (e.data.afUserIds = t);
                var r = getWebAppId();
                r && (e.data.webAppId = r);
                var o = function getOneLinkId() {
                    var e = getAfUserIds();
                    return e && e.olWebUserId || null
                }();
                o && (e.data.olWebUserId = o),
                e.meta.isDevMode = window.AF_SDK.PLUGINS.PBA.isDevModeOn()
            }(e);
            var t = !e.afWebUserId;
            return window.AF_SDK.PLUGINS.PBA.makeRequest(e, n, t),
            !t && !window.AF_SDK.PLUGINS.PBA.QHandler && window.AF_SDK.PLUGINS.PBA.emptyQ(window.AF_SDK.Q)
        }
        function addClientHints(e, n) {
            return new Promise(function(t) {
                if (function isUACHSupported() {
                    return "object" == typeof navigator && navigator.userAgentData && navigator.userAgentData.getHighEntropyValues
                }()) {
                    var r = window.AF_SDK.PLUGINS.PBA.afSync.createDeferred(navigator.userAgentData.getHighEntropyValues(["architecture", "bitness", "mobile", "model", "platform", "platformVersion", "uaFullVersion", "brands"]), function(n) {
                        n.brands = {
                            brands: n.brands
                        },
                        e.meta.clientHints = n,
                        t(e)
                    }, function() {
                        t(e)
                    });
                    window.AF_SDK.PLUGINS.PBA.afSync.makeExpiringPromise(r, n)
                } else
                    t(e)
            }
            )
        }
        function getAfWebUserId() {
            return window.AF_SDK.PLUGINS.PBA.afWebUserId ? window.AF_SDK.PLUGINS.PBA.afWebUserId : (window.AF_SDK.PLUGINS.PBA.afWebUserId = window.AF_SDK.utils.cookie.get(e),
            window.AF_SDK.PLUGINS.PBA.afWebUserId)
        }
        function getAfUserIds() {
            var e = window.AF_SDK.PLUGINS.PBA.afSync && window.AF_SDK.PLUGINS.PBA.afSync.afUserIds;
            return e && Object.keys(e).length && e || null
        }
        function getWebAppId() {
            return window.AF_SDK.initPluginsConfig.pba && window.AF_SDK.initPluginsConfig.pba.webAppId
        }
        function getLastInteraction() {
            return Number(window.AF_SDK.utils.storage.getItem(window.AF_SDK.CONST.AF_SESSION)) || 0
        }
        function lastInteractionSync(e) {
            var n = e.meta.timestamp;
            e.meta.lastInteractionTimestamp = getLastInteraction() || n,
            function updateLastInteraction(e) {
                window.AF_SDK.utils.storage.setItem(window.AF_SDK.CONST.AF_SESSION, e)
            }(n)
        }
        function completeAfSync(e) {
            waHandlerRequest(e, function() {
                window.AF_SDK.PLUGINS.PBA.afSync.postLoadSync().catch(function(e) {
                    window.AF_SDK.utils.logger("An error occurred on postLoadSync", e)
                })
            })
        }
        function invokeLoadEvent(e) {
            window.AF_SDK.PLUGINS.PBA.afSync.isSyncRequired() ? window.AF_SDK.PLUGINS.PBA.afSync.preLoadSync().then(function() {
                completeAfSync(e)
            }).catch(function(n) {
                window.AF_SDK.utils.logger("An error occurred on preLoadSync", n),
                completeAfSync(e)
            }) : waHandlerRequest(e)
        }
        return window.addEventListener ? window.addEventListener("beforeunload", setAfUserId, !1) : window.attachEvent ? window.attachEvent("onbeforeunload", setAfUserId) : window.onbeforeunload = setAfUserId,
        {
            VERSION: "0.0.54",
            url: "https://wa.appsflyer.com/events",
            afWebUserId: null,
            QHandler: null,
            coverDomain: "",
            afSync: t(1),
            disableMeasurement: function disableMeasurement() {
                try {
                    setMeasurementStatus(r, !1)
                } catch (e) {
                    return window.AF_SDK.utils.logger("Error occur in disableMeasurement function (main catch) after ", e)
                }
            },
            enableMeasurement: function enableMeasurement() {
                try {
                    setMeasurementStatus(r, !0).then(function whenOK() {
                        window.AF("pba", "load", {
                            eventType: "LOAD"
                        })
                    }).catch(function onError(e) {
                        return window.AF_SDK.utils.logger("Error occur in enableMeasurement function", e)
                    })
                } catch (e) {
                    return window.AF_SDK.utils.logger("Error occur in enableMeasurement function (main catch) after ", e)
                }
            },
            getMeasurementStatus: function getMeasurementStatus() {
                var e = function fetchMeasurementStatusData() {
                    var e = window.AF_SDK.utils.cookie.get(r)
                      , n = e ? "true" === e : null
                      , t = window.AF_SDK.utils.cookie.get(o);
                    return {
                        defaultMeasurementStatus: t ? "true" === t : null,
                        measurementStatus: n
                    }
                }();
                return function calculateMeasurementStatus(e, n) {
                    return null === n && null === e ? a : !1 === n ? i : null !== n || e ? a : i
                }(e.defaultMeasurementStatus, e.measurementStatus)
            },
            getAfWebUserId: getAfWebUserId,
            makeRequest: function makeRequest(e, n, t) {
                return new Promise(function(r) {
                    addClientHints(e, u).then(function(e) {
                        window.AF_SDK.xhr({
                            url: window.AF_SDK.PLUGINS.PBA.url,
                            body: e,
                            cb: function(e) {
                                !function waHandlerCbFn(e, n) {
                                    window.AF_SDK.PLUGINS.PBA.coverDomain = e.data.domain;
                                    var t = e.data.cookie || null;
                                    return t && (window.AF_SDK.PLUGINS.PBA.afWebUserId = t,
                                    setAfUserIdCookie(t)),
                                    n && !window.AF_SDK.PLUGINS.PBA.QHandler && window.AF_SDK.PLUGINS.PBA.emptyQ(window.AF_SDK.Q)
                                }(e, t),
                                n && n()
                            }
                        }),
                        r()
                    })
                }
                )
            },
            load: function(e) {
                try {
                    var t = function getMeasurementStatusFromSnippet() {
                        return window.AF_SDK.initPluginsConfig.pba[n]
                    }();
                    if ("boolean" == typeof t)
                        setMeasurementStatus(o, t).then(function whenOK() {
                            var n = window.AF_SDK.PLUGINS.PBA.getMeasurementStatus();
                            e && e.data && n && (lastInteractionSync(e),
                            setWebAppIdQueryParam(),
                            invokeLoadEvent(e))
                        }).catch(function onError(e) {
                            return window.AF_SDK.utils.logger("Error occur in load function after ", e)
                        });
                    else {
                        var r = window.AF_SDK.PLUGINS.PBA.getMeasurementStatus();
                        if (!e || !e.data || !r)
                            return;
                        lastInteractionSync(e),
                        setWebAppIdQueryParam(),
                        invokeLoadEvent(e)
                    }
                } catch (e) {
                    return window.AF_SDK.utils.logger("Error occur in load function (main catch) after ", e)
                }
            },
            event: function(e) {
                try {
                    var n = window.AF_SDK.PLUGINS.PBA.getMeasurementStatus();
                    if (!(e && e.data && e.data.eventType && e.data.eventType.length && n))
                        return;
                    return e.data.eventValue && window.AF_SDK.utils.isObject(e.data.eventValue) && (e.data.eventValue = window.AF_SDK.utils.tcJSON(e.data.eventValue, "stringify")),
                    e.meta.lastInteractionTimestamp = getLastInteraction(),
                    waHandlerRequest(e)
                } catch (e) {
                    return window.AF_SDK.utils.logger("Error occur in event function (main catch) after ", e)
                }
            },
            setCustomerUserId: function(e) {
                try {
                    var n = window.AF_SDK.PLUGINS.PBA.getMeasurementStatus();
                    if (!e || !n)
                        return;
                    var t = function transformSetCustomerUserIdParamsToSchema(e) {
                        try {
                            var n = e.data && e.data.arg;
                            if (!n)
                                return;
                            return delete e.data.arg,
                            Object.assign(e, {
                                data: Object.assign(e.data, {
                                    webAppId: getWebAppId(),
                                    eventType: "IDENTIFY",
                                    customUserId: n
                                }),
                                meta: Object.assign(e.meta, {
                                    lastInteractionTimestamp: getLastInteraction()
                                })
                            })
                        } catch (e) {
                            return void window.AF_SDK.utils.logger("Error occur in transformSetCustomerUserIdParamsToSchema function (main catch) after ", e)
                        }
                    }(e);
                    if (!t)
                        return;
                    return waHandlerRequest(t)
                } catch (e) {
                    return window.AF_SDK.utils.logger("Error occur in setCustomerUserId function (main catch) after ", e)
                }
            },
            emptyQ: function(e) {
                if (window.AF_SDK.PLUGINS.PBA.afWebUserId && window.AF_SDK.Q.length && function checkPbaQ(e) {
                    if (window.AF_SDK.PLUGINS.PBA.QHandler)
                        return !1;
                    for (var n = 0, t = 0, r = e.length; n < r; n++)
                        "pba" === e[n][1] && t++;
                    return t
                }(e))
                    return window.AF_SDK.PLUGINS.PBA.QHandler = !0,
                    window.AF_SDK.BASE.emptyQ(e, "pba")
            },
            turnOnDevMode: function() {
                window.AF_SDK.utils.cookie.set("AF_DEV_MODE", Date.now().toString(), {
                    expires: window.AF_SDK.utils.dateUtil().addHours(24),
                    path: "/",
                    domain: window.AF_SDK.PLUGINS.PBA.coverDomain
                })
            },
            isDevModeOn: function() {
                return null != window.AF_SDK.utils.cookie.get("AF_DEV_MODE")
            }
        }
    }()
}
, function(e, n, t) {
    "use strict";
    e.exports = function() {
        var e = "AF_SYNC"
          , n = "cookie"
          , t = 4e3
          , r = 168;
        function createTimeoutPromise(e) {
            var n, r = new Promise(function(r, o) {
                n = setTimeout(function() {
                    o(new Error("Request timed out"))
                }, e || t)
            }
            );
            return {
                timeoutId: n,
                promise: r
            }
        }
        function makeExpiringPromise(e, n) {
            var t = Array.isArray(e.promise) ? Promise.all(e.promise) : e.promise
              , r = createTimeoutPromise(n);
            return Promise.race([r.promise, t]).then(function(n) {
                e.resolve && e.resolve(n),
                clearTimeout(r.timeoutId)
            }).catch(function(n) {
                e.reject && e.reject(n),
                clearTimeout(r.timeoutId)
            })
        }
        function setSyncCookie() {
            window.AF_SDK.utils.cookie.set(e, Date.now().toString(), {
                path: "/",
                domain: window.AF_SDK.PLUGINS.PBA.coverDomain,
                expires: window.AF_SDK.utils.dateUtil().addHours(r)
            })
        }
        return {
            afUserIds: {},
            preloadCompleted: !1,
            vendorsConfig: {
                olWebUserId: "https://wa.onelink.me/v1/onelink"
            },
            setSyncCookie: setSyncCookie,
            timeoutPromise: createTimeoutPromise,
            buildSyncRequest: function buildSyncRequest(e, n) {
                return new Promise(function(r) {
                    try {
                        var o = window.AF_SDK.PLUGINS.PBA.afSync.vendorsConfig[e];
                        if (!o || !o.length)
                            return window.AF_SDK.utils.logger("Invalid afSync vendor config. vendorId: " + e),
                            r(!1);
                        var i = n && n.length ? o + "?af_id=" + n : o;
                        window.AF_SDK.xhr({
                            url: i,
                            method: "GET",
                            timeout: t,
                            errorCb: function() {
                                r(!1)
                            },
                            cb: function(n) {
                                var t = window.AF_SDK.PLUGINS.PBA.afSync.syncRequestCallback(e, n);
                                r(t)
                            }
                        })
                    } catch (n) {
                        window.AF_SDK.utils.logger("An error occurred during sync vendorId: " + e, n),
                        r(!1)
                    }
                }
                )
            },
            syncRequestCallback: function syncRequestCallback(e, t) {
                try {
                    return t.data && Object.prototype.hasOwnProperty.call(t.data, n) ? (t.data[n].length && (window.AF_SDK.PLUGINS.PBA.afSync.afUserIds[e] = t.data[n]),
                    !0) : (window.AF_SDK.utils.logger("Received invalid sync response. vendorId: " + e, t.data),
                    !1)
                } catch (n) {
                    return window.AF_SDK.utils.logger("An error occurred on sync response cb. vendorId: " + e, n),
                    !1
                }
            },
            isSyncRequired: function isSyncRequired() {
                var n = window.AF_SDK.PLUGINS.PBA.getAfWebUserId()
                  , t = window.AF_SDK.utils.cookie.get(e);
                return !n || !t
            },
            preLoadSync: function preLoadSync() {
                return new Promise(function(e, n) {
                    var r = window.AF_SDK.PLUGINS.PBA.afSync.vendorsConfig
                      , o = window.AF_SDK.PLUGINS.PBA.getAfWebUserId()
                      , i = Object.keys(r).map(function(e) {
                        return window.AF_SDK.PLUGINS.PBA.afSync.buildSyncRequest(e, o)
                    });
                    if (!i || !i.length)
                        return e();
                    makeExpiringPromise(window.AF_SDK.PLUGINS.PBA.afSync.createDeferred(i, function(t) {
                        if (t.some(function(e) {
                            return !e
                        }))
                            return window.AF_SDK.PLUGINS.PBA.afSync.preloadCompleted = !1,
                            n(new Error("vendor sync failure"));
                        window.AF_SDK.PLUGINS.PBA.afSync.preloadCompleted = !0,
                        e()
                    }, function(e) {
                        window.AF_SDK.PLUGINS.PBA.afSync.preloadCompleted = !1,
                        n(e)
                    }), t)
                }
                )
            },
            postLoadSync: function postLoadSync() {
                return new Promise(function(e, n) {
                    var r = window.AF_SDK.PLUGINS.PBA.getAfWebUserId();
                    if (!r)
                        return n(new Error("afWebUserId does not exist"));
                    var o = window.AF_SDK.PLUGINS.PBA.afSync.vendorsConfig
                      , i = window.AF_SDK.PLUGINS.PBA.afSync.afUserIds
                      , a = Object.keys(o).filter(function(e) {
                        return !Object.prototype.hasOwnProperty.call(i, e)
                    }).map(function(e) {
                        return window.AF_SDK.PLUGINS.PBA.afSync.buildSyncRequest(e, r)
                    });
                    if (!a || !a.length)
                        return setSyncCookie(),
                        e();
                    makeExpiringPromise(window.AF_SDK.PLUGINS.PBA.afSync.createDeferred(a, function(n) {
                        window.AF_SDK.PLUGINS.PBA.afSync.preloadCompleted && !n.some(function(e) {
                            return !e
                        }) && window.AF_SDK.PLUGINS.PBA.afSync.setSyncCookie(),
                        e()
                    }, function(e) {
                        n(e)
                    }), t)
                }
                )
            },
            createDeferred: function createDeferred(e, n, t) {
                return {
                    promise: e,
                    resolve: n,
                    reject: t
                }
            },
            makeExpiringPromise: makeExpiringPromise
        }
    }()
}
]);
!function(e) {
    var t = {};
    function __webpack_require__(r) {
        if (t[r])
            return t[r].exports;
        var n = t[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return e[r].call(n.exports, n, n.exports, __webpack_require__),
        n.l = !0,
        n.exports
    }
    __webpack_require__.m = e,
    __webpack_require__.c = t,
    __webpack_require__.d = function(e, t, r) {
        __webpack_require__.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: r
        })
    }
    ,
    __webpack_require__.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    __webpack_require__.t = function(e, t) {
        if (1 & t && (e = __webpack_require__(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var r = Object.create(null);
        if (__webpack_require__.r(r),
        Object.defineProperty(r, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var n in e)
                __webpack_require__.d(r, n, function(t) {
                    return e[t]
                }
                .bind(null, n));
        return r
    }
    ,
    __webpack_require__.n = function(e) {
        var t = e && e.__esModule ? function getDefault() {
            return e.default
        }
        : function getModuleExports() {
            return e
        }
        ;
        return __webpack_require__.d(t, "a", t),
        t
    }
    ,
    __webpack_require__.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    __webpack_require__.p = "",
    __webpack_require__(__webpack_require__.s = 2)
}([function(e, t, r) {
    "use strict";
    var n = {}
      , i = {};
    var a = /^([a-zA-Z0-9])([a-zA-Z0-9.+-]*):\/\/([^\s]+)?$/;
    var o = /[\\\/*!@#?$%^&~`=+'";:\s><]/
      , s = /^undefined$|^null$|^NaN$|^arg$/
      , d = /[;$><^# `]/
      , l = /%3E|%3C|%24|%3B|%5E|%20|%60|%23/;
    function _getValidParams(e) {
        var t, r, n = Object.keys(e), i = {}, a = 10;
        n.length < a && (a = n.length);
        for (var u = 0; u < a; u++) {
            var c = n[u];
            !(r = c) || s.test(r) || o.test(r) || (!(t = e[c]) && 0 !== t && !1 !== t || "string" != typeof t && "number" != typeof t && "boolean" != typeof t || l.test(t) || d.test(t)) || (i[c] = e[c])
        }
        return i
    }
    function _isUACHSupported() {
        return "object" == typeof navigator && navigator.userAgentData && navigator.userAgentData.getHighEntropyValues && !function isIOS() {
            return "object" == typeof navigator && navigator.userAgent && /iphone|ipad|ipod/i.test(navigator.userAgent)
        }()
    }
    e.exports = {
        after: function _after(e, t) {
            if (e < 0)
                throw new Error("Invalid argument count");
            if ("function" != typeof t)
                throw new Error("Invalid argument callback");
            var r = [];
            return function() {
                var n = Array.prototype.slice.call(arguments);
                if (r.push(n),
                0 == (e -= 1))
                    return t(r)
            }
        },
        pickUrlValues: function _pickUrlValues(e) {
            var t, r = [];
            for (var n in e)
                e.hasOwnProperty(n) && (t = e[n],
                a.test(t)) && r.push(e[n]);
            return r
        },
        timeLimitCallback: function _timeLimitCallback(e, t, r) {
            var n = !1
              , i = window.setTimeout(function() {
                n = !0,
                r && r()
            }, e);
            return function() {
                window.clearTimeout(i),
                n || t.apply(this, arguments)
            }
        },
        getAdditionalParams: function _getAdditionalParams() {
            return Object.assign({}, n)
        },
        setAdditionalParams: function _setAdditionalParams(e) {
            e && (n = Object.assign({}, e))
        },
        resetAdditionalParams: function _resetAdditionalParams() {
            n = {}
        },
        getValidParams: _getValidParams,
        getUpdateParams: function _getUpdateParams() {
            return Object.assign({}, i)
        },
        setUpdateParams: function _setUpdateParams(e) {
            var t = !!e && _getValidParams(e);
            t ? (i = Object.assign({}, t),
            window.AF_SDK.utils.logger("update params - success")) : window.AF_SDK.utils.logger("update params - failure: the sent parameters are invalid")
        },
        resetUpdateParams: function _resetUpdateParams() {
            i = {}
        },
        _getClientHints: function _getClientHints(e) {
            if (_isUACHSupported())
                try {
                    navigator.userAgentData.getHighEntropyValues(["model", "platformVersion"]).then(function(t) {
                        e && e(t)
                    })
                } catch (t) {
                    window.AF_SDK.utils.logger("An error occurred trying getting client hints", t),
                    e && e()
                }
            else
                e && e()
        }
    }
}
, function(e, t, r) {
    "use strict";
    var n = r(0)
      , i = "AF_FREQUENCY_CAPPING"
      , a = "AF_BANNERS_DISMISSAL"
      , o = "AF_BANNERS_SESSION_ID"
      , s = "AF_BANNERS_URL_QUERY"
      , d = "AF_BANNERS_URL_EXP"
      , l = "https://fvalid.appsflyer.com/af/cp.sdk.1.2.7.js";
    function generateUTMParams(e, t) {
        return Object.assign({}, e && t ? {
            c: e
        } : {}, t ? {
            pid: t,
            af_banner_build: "utm"
        } : {
            af_banner_build: "static"
        }, {
            af_banner_config: "utm"
        })
    }
    var u = {
        af_channel: "af_web_banner",
        pid: "af_banner"
    }
      , c = ["af_banner", "af_banner_sdk_ver"];
    e.exports = {
        initSession: function _initSession() {
            window.AF_SDK.utils.session.getItem(o) || window.AF_SDK.utils.session.setItem(o, (new Date).getTime().toString())
        },
        updateUrlQueryStorage: function _updateUrlQueryStorage() {
            var e = window.AF_SDK.utils.getUrlParamsObject({})
              , t = e.pid
              , r = e.utm_source
              , n = e.gclid
              , i = e.fbclid
              , a = e.gbraid
              , o = e.wbraid
              , l = Boolean(t || r || n || i || a || o)
              , u = window.AF_SDK.utils.storage.getItem(d, {});
            l ? (window.AF_SDK.utils.storage.setItem(s, location.search),
            window.AF_SDK.utils.storage.setItem(d, (new Date).getTime() + 72e5)) : u && u < new Date && (window.AF_SDK.utils.storage.removeItem(d),
            window.AF_SDK.utils.storage.removeItem(s))
        },
        canDisplayBanner: function _canDisplayBanner(e) {
            var t = -1 !== e.frequency_capping && (window.AF_SDK.utils.storage.getItem(i, {})[e.id] || 0) >= e.frequency_capping
              , r = !1
              , n = window.AF_SDK.utils.storage.getItem(a, {})[e.id];
            if (n && e.dismissal)
                switch (e.dismissal.type) {
                case "never":
                    r = !0;
                    break;
                case "period":
                    r = (new Date).getTime() - n < e.dismissal.value;
                    break;
                case "nextSession":
                    r = n === window.AF_SDK.utils.session.getItem(o)
                }
            return !t && !r
        },
        updateBannerDismissalInfo: function _updateBannerDismissalInfo(e) {
            var t = window.AF_SDK.utils.storage.getItem(a, {});
            "nextSession" === e.dismissal.type ? t[e.id] = window.AF_SDK.utils.session.getItem(o) : t[e.id] = (new Date).getTime().toString(),
            window.AF_SDK.utils.storage.setItem(a, t)
        },
        updateBannerFrequencyCapping: function _updateBannerFrequencyCapping(e, t) {
            if (!t && e.frequency_capping) {
                var r = window.AF_SDK.utils.storage.getItem(i, {});
                r[e.id] = (r[e.id] || 0) + 1,
                window.AF_SDK.utils.storage.setItem(i, r)
            }
        },
        buildUrlQueryString: function _buildUrlQueryString(e, t, r) {
            for (var i = function _extractDynamicParams(e) {
                var t = window.AF_SDK.utils.storage.getItem(s) || ""
                  , r = window.AF_SDK.utils.getUrlParamsObject({
                    search: t
                })
                  , n = r.utm_source
                  , i = r.utm_campaign
                  , a = r.gclid
                  , o = r.fbclid
                  , d = r.gbraid
                  , l = r.wbraid
                  , u = r.keyword
                  , c = (a || d || l) && u
                  , f = Object.assign({}, a && {
                    gclid: a
                }, o && {
                    fbclid: o
                }, d && {
                    gbraid: d
                }, l && {
                    wbraid: l
                }, c && {
                    af_keywords: u
                });
                switch (c && delete r.keyword,
                e) {
                case "utm":
                    return Object.assign(f, generateUTMParams(i, n), {
                        af_banner_config: "utm"
                    });
                case "partner":
                case "forward":
                    return r.pid ? Object.assign(f, r, {
                        af_banner_build: "forward",
                        af_banner_config: "forward"
                    }) : Object.assign(f, {
                        af_banner_build: "static",
                        af_banner_config: "forward"
                    });
                case "forward_utm":
                    return r.pid ? Object.assign(f, r, {
                        af_banner_build: "forward",
                        af_banner_config: "forward_utm"
                    }) : Object.assign(f, generateUTMParams(i, n), {
                        af_banner_config: "forward_utm"
                    });
                case "banner":
                default:
                    return Object.assign(f, {
                        af_banner_build: "static",
                        af_banner_config: "static"
                    })
                }
            }(e.attribution_method), a = n.getAdditionalParams(), o = n.getUpdateParams(), d = Object.assign({}, o, u, e.url.params, a, i), l = 0; l < c.length; l++)
                delete d[c[l]];
            return t && (d["af-sb-preview"] = !0),
            d.af_banner_sdk_ver = "2",
            r && (d.af_ch_model = encodeURIComponent(r.model),
            d.af_ch_os_version = encodeURIComponent(r.platformVersion)),
            Object.keys(d).map(function(e) {
                return "&" + e + "=" + d[e]
            }).join("")
        },
        isSDKDisabled: function _isSDKDisabled() {
            return "true" === window.AF_SDK.utils.getUrlParamsObject({})["af-sb-disable"]
        },
        fetchCpSdk: function _fetchCpSdk() {
            if ("https:" === document.location.protocol && !window.AF_SDK.PLUGINS.BANNERS.getClickValidationToken) {
                var e = document.createElement("script");
                e.src = l,
                e.onload = function() {
                    window.onAFReady = function(e) {
                        window.AF_SDK.PLUGINS.BANNERS.getClickValidationToken = e.getToken.bind(e)
                    }
                }
                ;
                var t = document.getElementsByTagName("script")[0];
                t.parentNode.insertBefore(e, t)
            }
        }
    }
}
, function(e, t, r) {
    "use strict";
    var n = r(3)
      , i = r(0)
      , a = r(4)
      , o = r(5)
      , s = r(1)
      , d = r(8)
      , l = r(9)
      , u = window.AF_cleanupMethods = window.AF_cleanupMethods || [];
    function _init() {
        s.initSession(),
        s.updateUrlQueryStorage()
    }
    function _displayBanner(e, t) {
        (t = t || {}).key;
        var r = a.prefetchAssets(e.creative.prefetch_urls, function(r) {
            if (r)
                window.AF_SDK.utils.logger("failed loading assets, banner is hidden"),
                _hideBanner();
            else
                try {
                    var n = o.render(e.creative, t);
                    d.injectPixel(e),
                    u.push(n);
                    var i = document.body.querySelector("[data-af-cta-button]");
                    document.body.querySelector("[data-af-close-button]").onclick = function _getHideBannerHandler(e, t, r) {
                        return !r && t.dismissal ? function() {
                            s.updateBannerDismissalInfo(t),
                            _hideBanner()
                        }
                        : _hideBanner
                    }(0, e, t.preview),
                    function _setQaAttributes(e, t, r) {
                        var n = e.url.path + s.buildUrlQueryString(e, t);
                        r.setAttribute("data-af-cta-url", n)
                    }(e, t.preview, i),
                    i.onclick = function _getBannerClickedHandler(e, t) {
                        return function(r) {
                            var n = e.url.path + s.buildUrlQueryString(e, t)
                              , i = "";
                            if (window.AF_SDK.utils.logger("oneLink URL: " + n),
                            window.AF_SDK.PLUGINS.BANNERS.getClickValidationToken)
                                try {
                                    i = window.AF_SDK.PLUGINS.BANNERS.getClickValidationToken(r)
                                } catch (e) {
                                    window.AF_SDK.utils.logger("error - failed to generate token: " + e)
                                }
                            window.location.href = n + "&af_token=" + i + "&"
                        }
                    }(e, t.preview),
                    s.updateBannerFrequencyCapping(e, t.preview)
                } catch (e) {
                    _hideBanner(),
                    window.AF_SDK.utils.logger(e)
                }
        });
        u.push(r)
    }
    function _showBanner(e) {
        if (e = e ? e.data : {},
        l.any) {
            var t = document.createElement("p");
            if (t.style.display = "flex",
            "flex" === t.style.display)
                if (s.isSDKDisabled())
                    window.AF_SDK.utils.logger("SDK is disabled by query param af-sb-disable.");
                else {
                    _hideBanner(),
                    i.setAdditionalParams(e.additionalParams);
                    var r = e.key || window.AF_SDK.initPluginsConfig.banners && window.AF_SDK.initPluginsConfig.banners.key;
                    if (r) {
                        var a = {
                            key: r
                        }
                          , o = window.AF_SDK.utils.getUrlParamsObject({})["af-sb-id"]
                          , d = o || e.creativeId || e.bannerId;
                        d && (a.creativeId = d),
                        o ? n.getBannerForPreview(a, function(t, r) {
                            if (!t && r && r.length && r[0]) {
                                var i = r[0];
                                n.getBannerAsset(i.creative_url, function(t, n) {
                                    !t && n && _displayBanner(Object.assign(r[0], {
                                        creative: n
                                    }), e)
                                })
                            }
                        }) : n.getBanners(a, function(t, r) {
                            !t && r && r.length && function _getBannersAssets(e, t, r) {
                                for (var i = 0; i < e.length; i++) {
                                    var a = e[i];
                                    if (s.canDisplayBanner(a) && a.creative_url) {
                                        n.getBannerAsset(a.creative_url, function(e, t) {
                                            !e && t && _displayBanner(Object.assign(a, {
                                                creative: t
                                            }), r)
                                        });
                                        break
                                    }
                                    window.AF_SDK.utils.logger("Banner [" + a.id + "] could not be displayed due to it`s frequency cap or dismissal rules")
                                }
                            }(r, 0, e)
                        })
                    } else
                        window.AF_SDK.utils.logger("key param must be provided for getting banners from the server")
                }
            else
                window.AF_SDK.utils.logger("We detected a browser that doesn't support flex, displaying banners in this browser is disabled.")
        } else
            window.AF_SDK.utils.logger("We detected a non-mobile browser, displaying banners in this browser is disabled.")
    }
    function _hideBanner() {
        if (u.length) {
            window.AF_SDK.utils.logger("Removing displayed banner from the page...");
            for (var e = 0; e < u.length; e++)
                u[e]();
            window.AF_cleanupMethods = u = []
        }
        i.resetAdditionalParams(),
        i.resetUpdateParams()
    }
    function _safeExport(e) {
        return Object.keys(e).reduce(function(t, r) {
            return t[r] = function _safeExec(e, t) {
                return e && "function" == typeof e ? function() {
                    try {
                        return e.apply(null, arguments)
                    } catch (e) {
                        console.log("error", e)
                    }
                }
                : e
            }(e[r]),
            t
        }, {})
    }
    function _updateParams(e) {
        var t = e ? e.data : {};
        i.setUpdateParams(t)
    }
    window.AF.plugins.BANNERS = _safeExport({
        load: _init,
        showBanner: _showBanner,
        hideBanner: _hideBanner,
        updateParams: _updateParams,
        VERSION: "0.0.54"
    })
}
, function(e, t, r) {
    "use strict";
    var n = "https://banner.appsflyer.com/";
    e.exports = {
        getBanners: function _getBanners(e, t) {
            var r = n;
            if (e && e.key) {
                var i = r + "sb/" + e.key + "/creative/list";
                e.creativeId && (i += "?creativeId=" + e.creativeId),
                window.AF_SDK.xhr({
                    method: "POST",
                    url: i,
                    body: {
                        "af-full-referer": window.location && window.location.href
                    },
                    data: e,
                    withCredentials: !1,
                    cb: function(r) {
                        if (!r || !r.data) {
                            var n = "fetch banners didn't return data";
                            return window.AF_SDK.utils.logger("Getting creatives for key [" + e.key + "] from the server... received, error: ", n),
                            t && t({
                                text: n
                            })
                        }
                        window.AF_SDK.utils.logger("Getting creatives for key [" + e.key + "] from the server... received: ", r),
                        t && t(null, r.data)
                    },
                    fail: function(r) {
                        return window.AF_SDK.utils.logger("Getting creatives for key [" + e.key + "] from the server... received, error: ", r),
                        t && t(r)
                    }
                })
            } else
                window.AF_SDK.utils.logger("Could not retrieve creatives, no key (mandatory) provided")
        },
        getBannerForPreview: function _getBannerForPreview(e, t) {
            var r = n;
            e && e.key && e.creativeId ? window.AF_SDK.xhr({
                method: "GET",
                withCredentials: !1,
                url: r + "sb/" + e.key + "/creative/" + e.creativeId + "/preview",
                cb: function(r, n) {
                    if (!r || !r.data) {
                        var i = "fetch banner preview didn't return data";
                        return window.AF_SDK.utils.logger("Getting creative [" + e.creativeId + "] from the server... received, error: ", i),
                        t && t({
                            text: i
                        })
                    }
                    window.AF_SDK.utils.logger("Getting creative [" + e.creativeId + "] from the server... received: ", r.data[0]),
                    r && t && t(null, r.data)
                },
                fail: function(r) {
                    return window.AF_SDK.utils.logger("Getting creative [" + e.creativeId + "] from the server... received, error: ", r),
                    t && t(r)
                }
            }) : window.AF_SDK.utils.logger("Could not retrieve creative, no creativeId/key (mandatory) provided")
        },
        getBannerAsset: function _getBannerAsset(e, t) {
            window.AF_SDK.xhr({
                method: "GET",
                withCredentials: !1,
                url: e,
                cb: function(r) {
                    if (!r || !r.data) {
                        var n = "fetch banner creative asset didn't return data";
                        return window.AF_SDK.utils.logger("Getting banner-creative asset [" + e + "] from the server... received, error: ", n),
                        t({
                            text: n
                        })
                    }
                    t(null, r.data)
                },
                fail: function(r) {
                    return window.AF_SDK.utils.logger("Getting banner-creative asset [" + e + "] from the server... received, error: ", r),
                    t(r)
                }
            })
        }
    }
}
, function(e, t, r) {
    "use strict";
    var n = r(0);
    var i = function(e, t, r) {
        for (var i = 0; i < e.length; i++) {
            var a = new Image(1,1)
              , o = n.timeLimitCallback(r, function(e) {
                e && "error" === e.type ? t("Failed fetching " + e.target.src) : t()
            }, function() {
                t("Request timed out")
            });
            a.onload = o,
            a.onerror = o,
            a.src = e[i]
        }
    };
    e.exports = {
        prefetchAssets: function _prefetchAssets(e, t) {
            var r = window.AF_SDK.utils.getUrlParamsObject({})["af-sb-timeout"] || 1e4
              , a = !1;
            if (0 === e.length)
                t();
            else {
                var o = n.after(e.length, function(e) {
                    if (!a) {
                        var r = function _getFirstError(e) {
                            if (!e)
                                return null;
                            for (var t = 0; t < e.length; t++)
                                if (e[t].length)
                                    return e[t][0];
                            return null
                        }(e);
                        r ? t(r) : t()
                    }
                });
                i(e, o, r)
            }
            return function() {
                a = !0
            }
        }
    }
}
, function(e, t, r) {
    "use strict";
    var n = r(6).inject;
    e.exports = {
        render: function _render(e, t) {
            try {
                return n(e.layout, e.style, e.script, e.position, {
                    mountTargetSelector: t.bannerContainerQuery,
                    zIndex: t.bannerZIndex || 2147483647
                })
            } catch (e) {
                throw window.AF_SDK.utils.logger(e.message),
                e
            }
        }
    }
}
, function(e, t, r) {
    e.exports = {
        inject: r(7).inject
    }
}
, function(e, t, r) {
    "use strict";
    function _resetTransform(e) {
        return function() {
            e && (e.style.transform = "")
        }
    }
    function _createElement(e, t) {
        var r = document.createElement(t || "div");
        return r.innerHTML = e,
        t ? r : r.children[0]
    }
    e.exports = {
        inject: function _inject(e, t, r, n, i) {
            var a = []
              , o = []
              , s = i && i.mountTargetSelector
              , d = i && i.zIndex;
            if (!e || !t || !n)
                throw new Error("Failed to inject banner - missing arguments");
            var l = _createElement(e);
            "number" == typeof d && (l.style.zIndex = d);
            var u = s && document.querySelector(s) || document.body;
            if (t) {
                var c = _createElement(t, "style");
                document.head.insertBefore(c, document.head.firstChild),
                a.push(c)
            }
            switch (n) {
            case "top":
                u.insertBefore(l, u.firstChild),
                a.push(l);
                break;
            case "top-sticky":
                l.style.position = "fixed",
                l.style.top = "0",
                l.style.right = "0",
                l.style.left = "0",
                u.insertBefore(l, u.firstChild),
                (f = document.createElement("div")).style.height = l.offsetHeight + "px",
                u.insertBefore(f, l),
                a.push(l, f);
                break;
            case "bottom":
                var f;
                l.style.position = "fixed",
                l.style.bottom = "0",
                l.style.right = "0",
                l.style.left = "0",
                u.appendChild(l),
                s && !u.style.transform && (u.style.transform = "translate(0)",
                o.push(_resetTransform(u))),
                (f = document.createElement("div")).style.height = l.offsetHeight + "px",
                u.appendChild(f),
                a.push(l, f);
                break;
            case "splash":
                l.style.position = "fixed",
                l.style.right = "0",
                l.style.left = "0",
                u.appendChild(l),
                s && !u.style.transform && (u.style.transform = "translate(0)",
                o.push(_resetTransform(u))),
                l.style.top = "calc(50% - " + l.offsetHeight / 2 + "px)",
                a.push(l);
                break;
            case "floating-top":
            case "floating-bottom":
                u.appendChild(l),
                a.push(l)
            }
            if (r) {
                var _ = _createElement(r, "script");
                document.body.appendChild(_),
                a.push(_)
            }
            return function _getCleanupFunction(e, t) {
                return function() {
                    if (e)
                        for (var r = 0; r < e.length; r++) {
                            var n = e[r];
                            n.parentNode && n.parentNode.removeChild(n)
                        }
                    if (t)
                        for (r = 0; r < t.length; r++)
                            t[r]()
                }
            }(a, o)
        }
    }
}
, function(e, t, r) {
    "use strict";
    var n = r(1)
      , i = r(0)
      , a = function(e) {
        var t = new Image(1,1);
        t.style.display = "none",
        t.style.position = "absolute",
        t.style.left = "-1px",
        t.style.top = "-1px",
        t.src = e
    };
    function _buildUrlForImpression(e, t) {
        i._getClientHints(function(r) {
            var i = n.buildUrlQueryString(e, !1, r)
              , a = e.url.path.match("(https:\\/\\/)(([^\\.][^\\.]+).)(.*\\/)(.*)");
            t && t("https://impressions." + a[4] + a[5] + i)
        })
    }
    e.exports = {
        buildUrlForImpression: _buildUrlForImpression,
        injectPixel: function _injectPixel(e) {
            _buildUrlForImpression(e, function(e) {
                a(e)
            })
        }
    }
}
, function(e, t, r) {
    var n, a, o;
    !function(r) {
        var s = /iPhone/i
          , d = /iPod/i
          , l = /iPad/i
          , u = /\bAndroid(?:.+)Mobile\b/i
          , c = /Android/i
          , f = /\bAndroid(?:.+)SD4930UR\b/i
          , _ = /\bAndroid(?:.+)(?:KF[A-Z]{2,4})\b/i
          , p = /Windows Phone/i
          , g = /\bWindows(?:.+)ARM\b/i
          , w = /BlackBerry/i
          , b = /BB10/i
          , v = /Opera Mini/i
          , h = /\b(CriOS|Chrome)(?:.+)Mobile/i
          , y = /Mobile(?:.+)Firefox\b/i;
        function m(e, t) {
            return e.test(t)
        }
        function i(e) {
            var t = e || ("undefined" != typeof navigator ? navigator.userAgent : "")
              , r = t.split("[FBAN");
            void 0 !== r[1] && (t = r[0]),
            void 0 !== (r = t.split("Twitter"))[1] && (t = r[0]);
            var n = {
                apple: {
                    phone: m(s, t) && !m(p, t),
                    ipod: m(d, t),
                    tablet: !m(s, t) && m(l, t) && !m(p, t),
                    device: (m(s, t) || m(d, t) || m(l, t)) && !m(p, t)
                },
                amazon: {
                    phone: m(f, t),
                    tablet: !m(f, t) && m(_, t),
                    device: m(f, t) || m(_, t)
                },
                android: {
                    phone: !m(p, t) && m(f, t) || !m(p, t) && m(u, t),
                    tablet: !m(p, t) && !m(f, t) && !m(u, t) && (m(_, t) || m(c, t)),
                    device: !m(p, t) && (m(f, t) || m(_, t) || m(u, t) || m(c, t)) || m(/\bokhttp\b/i, t)
                },
                windows: {
                    phone: m(p, t),
                    tablet: m(g, t),
                    device: m(p, t) || m(g, t)
                },
                other: {
                    blackberry: m(w, t),
                    blackberry10: m(b, t),
                    opera: m(v, t),
                    firefox: m(y, t),
                    chrome: m(h, t),
                    device: m(w, t) || m(b, t) || m(v, t) || m(y, t) || m(h, t)
                }
            };
            return n.any = n.apple.device || n.android.device || n.windows.device || n.other.device,
            n.phone = n.apple.phone || n.android.phone || n.windows.phone,
            n.tablet = n.apple.tablet || n.android.tablet || n.windows.tablet,
            n
        }
        e.exports && "undefined" == typeof window ? e.exports = i : e.exports && "undefined" != typeof window ? (e.exports = i(),
        e.exports.isMobile = i) : (a = [],
        n = r.isMobile = i(),
        void 0 === (o = "function" == typeof n ? n.apply(t, a) : n) || (e.exports = o))
    }(this)
}
]);
!function(e) {
    var t = {};
    function __webpack_require__(n) {
        if (t[n])
            return t[n].exports;
        var o = t[n] = {
            i: n,
            l: !1,
            exports: {}
        };
        return e[n].call(o.exports, o, o.exports, __webpack_require__),
        o.l = !0,
        o.exports
    }
    __webpack_require__.m = e,
    __webpack_require__.c = t,
    __webpack_require__.d = function(e, t, n) {
        __webpack_require__.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: n
        })
    }
    ,
    __webpack_require__.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    __webpack_require__.t = function(e, t) {
        if (1 & t && (e = __webpack_require__(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var n = Object.create(null);
        if (__webpack_require__.r(n),
        Object.defineProperty(n, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var o in e)
                __webpack_require__.d(n, o, function(t) {
                    return e[t]
                }
                .bind(null, o));
        return n
    }
    ,
    __webpack_require__.n = function(e) {
        var t = e && e.__esModule ? function getDefault() {
            return e.default
        }
        : function getModuleExports() {
            return e
        }
        ;
        return __webpack_require__.d(t, "a", t),
        t
    }
    ,
    __webpack_require__.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    __webpack_require__.p = "",
    __webpack_require__(__webpack_require__.s = 0)
}([function(e, t, n) {
    "use strict";
    n(1),
    n(2),
    function() {
        if ("loading" !== document.readyState)
            return setTimeout.bind(null, init, 0)();
        function init() {
            var e;
            window.AF_SDK = window.AF_SDK || {
                CONST: {
                    AF_SESSION: "AF_SESSION"
                },
                utils: n(3),
                xhr: n(9),
                initPluginsConfig: (e = window.AF.id,
                "string" == typeof e ? {
                    pba: {
                        webAppId: e
                    }
                } : e),
                BASE: sdkBase(),
                PLUGINS: window.AF.plugins || {}
            };
            var t, o, i = Object.keys(window.AF_SDK.PLUGINS);
            window.AF_SDK.Q = window.AF && window.AF.q ? window.AF.q.slice(0) : [],
            window.AF = (t = window.AF_SDK.utils.fingerPrint(),
            o = function getSdkVersion() {
                for (var e = 0, t = {}, n = i.length; e < n; e++)
                    window.AF_SDK.PLUGINS[i[e]].VERSION && (t[i[e]] = window.AF_SDK.PLUGINS[i[e]].VERSION);
                return Object.assign({
                    BASE: "0.0.54"
                }, t)
            }(),
            function(e, n, i) {
                if (e && n) {
                    i = arguments.length < 3 || !arguments[2] || !window.AF_SDK.utils.isObject(arguments[2]) ? window.AF_SDK.utils.createArgObject(arguments[2]) : arguments[2];
                    var r = window.AF_SDK.BASE.fetchFunc(e, n);
                    if (r) {
                        var a = window.AF_SDK.utils.getUrlParamsObject({
                            search: window.location.search
                        })
                          , s = window.top.document.referrer || ""
                          , c = Number(Date.now());
                        return r(Object.assign({}, {
                            data: i
                        }, {
                            meta: Object.assign({}, t, {
                                version: o,
                                query: a,
                                referrer: s,
                                timestamp: c
                            })
                        }))
                    }
                }
            }
            ),
            function initialLoad() {
                for (var e = 0, t = i.length; e < t; e++)
                    window.AF(i[e].toLowerCase(), "load", {
                        eventType: "LOAD"
                    })
            }(),
            window.AF_SDK.Q.length && window.AF_SDK.BASE.emptyQ(window.AF_SDK.Q)
        }
        function sdkBase() {
            function returnLogger(e) {
                return window.AF_SDK.utils.logger(e),
                !1
            }
            return {
                fetchFunc: function(e, t) {
                    if (!window.AF_SDK)
                        return returnLogger("AF_SDK global is not available on window");
                    var n = e.toUpperCase();
                    return window.AF_SDK.PLUGINS[n] ? window.AF_SDK.PLUGINS[n] && window.AF_SDK.PLUGINS[n][t] || window.AF_SDK.BASE[t] || returnLogger(t + " does not exist in our SDK, please check the documentation") : returnLogger(n + " is missing in AF_SDK, please add this SDK to the snippet")
                },
                emptyQ: function(e, t) {
                    if (e.length)
                        for (var n = 0; n < e.length; )
                            e[n].length < 3 || window.AF_SDK.PLUGINS[e[n][1].toUpperCase()].emptyQ && !t ? n++ : e[n].length < 3 && t && e[n][1] !== t ? n++ : (e[n][3] = window.AF_SDK.utils.isObject(e[n][3]) ? e[n][3] : window.AF_SDK.utils.createArgObject(e[n][3]),
                            window.AF(e[n][1], e[n][2], e[n][3] ? Object.assign(e[n][3], {
                                qTimestamp: Number(e[n][0])
                            }) : {
                                qTimestamp: Number(e[n][0])
                            }),
                            e.splice(n, 1))
                }
            }
        }
        window.addEventListener ? window.addEventListener("DOMContentLoaded", setTimeout.bind(null, init, 0), !1) : window.attachEvent ? window.attachEvent("onDOMContentLoaded", setTimeout.bind(null, init, 0)) : window.onload = init
    }(window, document)
}
, function(e, t, n) {
    "use strict";
    e.exports = void (Object.keys || (Object.keys = function(e) {
        if (e !== Object(e))
            throw new TypeError("Object.keys called on a non-object");
        var t, n = [];
        for (t in e)
            Object.prototype.hasOwnProperty.call(e, t) && n.push(t);
        return n
    }
    ))
}
, function(e, t, n) {
    "use strict";
    e.exports = void (Object.assign || Object.defineProperty(Object, "assign", {
        enumerable: !1,
        configurable: !0,
        writable: !0,
        value: function(e) {
            if (null == e)
                throw new TypeError("Cannot convert first argument to object");
            for (var t = Object(e), n = 1; n < arguments.length; n++) {
                var o = arguments[n];
                if (null != o) {
                    o = Object(o);
                    for (var i = Object.keys(Object(o)), r = 0, a = i.length; r < a; r++) {
                        var s = i[r]
                          , c = Object.getOwnPropertyDescriptor(o, s);
                        void 0 !== c && c.enumerable && (t[s] = o[s])
                    }
                }
            }
            return t
        }
    }))
}
, function(e, t, n) {
    "use strict";
    e.exports = function() {
        var e = !!getUrlParamsObject({
            key: "af-sdk-dev"
        });
        function getUrlParamsObject(e) {
            if ((e = arguments.length <= 0 || !arguments[0] ? {
                search: null
            } : arguments[0]).search = e.hasOwnProperty("search") ? e.search : location.search,
            e.key = e.hasOwnProperty("key") ? e.key : null,
            e.params = {},
            !e.search.length)
                return e.params;
            for (var t = ("?" === e.search[0] ? e.search.substr(1) : e.search).split("&"), n = 0, o = t.length; n < o; n++)
                if (-1 !== t[n].indexOf("=")) {
                    var i = t[n].split("=");
                    if (i[0].length && (e.params[decodeURIComponent(i[0])] = decodeURIComponent(i[1]) || null),
                    e.key && decodeURIComponent(i[0]) === e.key)
                        return decodeURIComponent(i[1]) || null
                }
            return e.params
        }
        return {
            logger: function logger(e, t) {},
            getUrlParamsObject: getUrlParamsObject,
            env: function env() {
                return e
            },
            isJson: function isJson(e) {
                if (!e)
                    return !1;
                var t = [e.substr(0, 1), e.substr(-1)];
                return !("{" !== t[0] && "[" !== t[0] || "}" !== t[1] && "]" !== t[1])
            },
            isObject: function isObject(e) {
                return "[object Object]" === Object.prototype.toString.call(e)
            },
            isArray: function isArray(e) {
                return "[object Array]" === Object.prototype.toString.call(e)
            },
            tcJSON: function tcJSON(e, t) {
                try {
                    return JSON[t](e)
                } catch (t) {
                    return e
                }
            },
            dateUtil: function dateUtil() {
                return Date.prototype.addHours = function(e) {
                    return this.setHours(this.getHours() + e),
                    this
                }
                ,
                Date.prototype.addYears = function(e) {
                    return this.setYear(this.getFullYear() + e),
                    this
                }
                ,
                new Date
            },
            createArgObject: function createArgObject(e) {
                return {
                    arg: e
                }
            },
            fingerPrint: n(4),
            storage: n(6),
            session: n(7),
            cookie: n(8)
        }
    }()
}
, function(e, t, n) {
    "use strict";
    n(5);
    e.exports = function() {
        function setResponse(e) {
            return "NOT_SUPPORTED" === e ? e : e ? "ENABLED" : "DISABLED"
        }
        return {
            userAgent: function userAgent() {
                return navigator.userAgent || ""
            }(),
            webDriver: function webDriver() {
                return setResponse(navigator.webdriver || "NOT_SUPPORTED")
            }(),
            languageKey: function languageKey() {
                return navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || ""
            }(),
            colorDepthKey: function colorDepthKey() {
                return window.screen && window.screen.colorDepth || -1
            }(),
            cookieEnabled: function cookieEnabled() {
                return navigator.cookieEnabled || !1
            }(),
            deviceMemoryKey: function deviceMemoryKey() {
                return navigator.deviceMemory || -1
            }(),
            pixelRatioKey: function pixelRatioKey() {
                return window.devicePixelRatio || -1
            }(),
            screenResolutionWidth: function screenResolutionWidth() {
                return window.screen && window.screen.width || -1
            }(),
            screenResolutionHeight: function screenResolutionHeight() {
                return window.screen && window.screen.height || -1
            }(),
            locationHref: window.location ? window.location.href : "NOT_SUPPORTED",
            locationSearch: window.location ? window.location.search : "NOT_SUPPORTED",
            locationOrigin: window.location ? window.location.origin : "NOT_SUPPORTED",
            screenOrientation: function screenOrientation() {
                return {
                    angle: window.screen && window.screen.orientation && window.screen.orientation.angle || 0,
                    type: window.screen && window.screen.orientation && window.screen.orientation.type || "NOT_SUPPORTED"
                }
            }(),
            availableScreenResolutionWidth: function availableScreenResolutionWidth() {
                return window.screen && window.screen.availWidth || -1
            }(),
            availableScreenResolutionHeight: function availableScreenResolutionHeight() {
                return window.screen && window.screen.availHeight || -1
            }(),
            timezoneOffset: function timezoneOffset() {
                return (new Date).getTimezoneOffset() || 0
            }(),
            timeZone: function timeZone() {
                return window.Intl && window.Intl.DateTimeFormat ? (new window.Intl.DateTimeFormat).resolvedOptions().timeZone : ""
            }(),
            sessionStorageKey: function sessionStorageKey() {
                try {
                    return setResponse(window.sessionStorage)
                } catch (e) {
                    return "NOT_SUPPORTED"
                }
            }(),
            localStorageKey: function localStorageKey() {
                try {
                    return setResponse(window.localStorage)
                } catch (e) {
                    return "NOT_SUPPORTED"
                }
            }(),
            indexedDbKey: function indexedDbKey() {
                try {
                    return setResponse(window.indexedDB)
                } catch (e) {
                    return "NOT_SUPPORTED"
                }
            }(),
            addBehaviorKey: function addBehaviorKey() {
                return setResponse(document.body && document.body.addBehavior || "NOT_SUPPORTED")
            }(),
            openDatabaseKey: function openDatabaseKey() {
                return setResponse(window.openDatabase || "NOT_SUPPORTED")
            }(),
            cpuClassKey: function cpuClassKey() {
                return setResponse(navigator.cpuClass || "NOT_SUPPORTED")
            }(),
            platformKey: function platformKey() {
                return setResponse(navigator.platform || "NOT_SUPPORTED")
            }(),
            doNotTrackKey: function doNotTrackKey() {
                return setResponse(navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack || "NOT_SUPPORTED")
            }(),
            isCanvasSupported: function isCanvasSupported() {
                var e = document.createElement("canvas");
                return setResponse(e.getContext && e.getContext("2d") || "NOT_SUPPORTED")
            }(),
            adBlockKey: function adBlockKey() {
                var e = document.createElement("div");
                e.innerHTML = "&nbsp;",
                e.className = "adsbox";
                var t = !1;
                try {
                    document.body.appendChild(e),
                    t = 0 === document.getElementsByClassName("adsbox")[0].offsetHeight,
                    document.body.removeChild(e)
                } catch (e) {
                    t = "NOT_SUPPORTED"
                }
                return setResponse(t)
            }(),
            hasLiedLanguagesKey: function hasLiedLanguagesKey() {
                try {
                    return setResponse(!!navigator.languages && navigator.languages[0].substr(0, 2) !== navigator.language.substr(0, 2))
                } catch (e) {
                    return "NOT_SUPPORTED"
                }
            }(),
            javaEnabled: function javaEnabled() {
                return setResponse(navigator.javaEnabled() || !1)
            }(),
            deviceClockSpeed: function deviceClockSpeed() {
                return window.performance && window.performance.now() || -1
            }(),
            loadEventStart: function loadEventStart() {
                return window.performance ? window.performance.timing.loadEventStart : -1
            }(),
            loadEventEnd: function loadEventEnd() {
                return window.performance ? window.performance.timing.loadEventEnd : -1
            }(),
            loadTime: function loadTime() {
                return window.performance ? window.performance.timing.loadEventEnd - window.performance.timing.loadEventStart : -1
            }(),
            documentLoad: function documentLoad() {
                return window.performance ? window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart : -1
            }()
        }
    }
}
, function(e, t, n) {
    "use strict";
    e.exports = function() {
        var e = ["monospace", "sans-serif", "serif"]
          , t = ["Abadi MT Condensed Light", "Adobe Fangsong Std", "Adobe Hebrew", "Adobe Ming Std", "Agency FB", "Aharoni", "Andalus", "Angsana New", "AngsanaUPC", "Aparajita", "Arab", "Arabic Transparent", "Arabic Typesetting", "Arial Baltic", "Arial Black", "Arial CE", "Arial CYR", "Arial Greek", "Arial TUR", "Arial", "Batang", "BatangChe", "Bauhaus 93", "Bell MT", "Bitstream Vera Serif", "Bodoni MT", "Bookman Old Style", "Braggadocio", "Broadway", "Browallia New", "BrowalliaUPC", "Calibri Light", "Calibri", "Californian FB", "Cambria Math", "Cambria", "Candara", "Castellar", "Casual", "Centaur", "Century Gothic", "Chalkduster", "Colonna MT", "Comic Sans MS", "Consolas", "Constantia", "Copperplate Gothic Light", "Corbel", "Cordia New", "CordiaUPC", "Courier New Baltic", "Courier New CE", "Courier New CYR", "Courier New Greek", "Courier New TUR", "Courier New", "DFKai-SB", "DaunPenh", "David", "DejaVu LGC Sans Mono", "Desdemona", "DilleniaUPC", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Engravers MT", "Eras Bold ITC", "Estrangelo Edessa", "EucrosiaUPC", "Euphemia", "Eurostile", "FangSong", "Forte", "FrankRuehl", "Franklin Gothic Heavy", "Franklin Gothic Medium", "FreesiaUPC", "French Script MT", "Gabriola", "Gautami", "Georgia", "Gigi", "Gisha", "Goudy Old Style", "Gulim", "GulimChe", "GungSeo", "Gungsuh", "GungsuhChe", "Haettenschweiler", "Harrington", "Hei S", "HeiT", "Heisei Kaku Gothic", "Hiragino Sans GB", "Impact", "Informal Roman", "IrisUPC", "Iskoola Pota", "JasmineUPC", "KacstOne", "KaiTi", "Kalinga", "Kartika", "Khmer UI", "Kino MT", "KodchiangUPC", "Kokila", "Kozuka Gothic Pr6N", "Lao UI", "Latha", "Leelawadee", "Levenim MT", "LilyUPC", "Lohit Gujarati", "Loma", "Lucida Bright", "Lucida Console", "Lucida Fax", "Lucida Sans Unicode", "MS Gothic", "MS Mincho", "MS PGothic", "MS PMincho", "MS Reference Sans Serif", "MS UI Gothic", "MV Boli", "Magneto", "Malgun Gothic", "Mangal", "Marlett", "Matura MT Script Capitals", "Meiryo UI", "Meiryo", "Menlo", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Sans Serif", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU-ExtB", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "Miriam Fixed", "Miriam", "Mongolian Baiti", "MoolBoran", "NSimSun", "Narkisim", "News Gothic MT", "Niagara Solid", "Nyala", "PMingLiU", "PMingLiU-ExtB", "Palace Script MT", "Palatino Linotype", "Papyrus", "Perpetua", "Plantagenet Cherokee", "Playbill", "Prelude Bold", "Prelude Condensed Bold", "Prelude Condensed Medium", "Prelude Medium", "PreludeCompressedWGL Black", "PreludeCompressedWGL Bold", "PreludeCompressedWGL Light", "PreludeCompressedWGL Medium", "PreludeCondensedWGL Black", "PreludeCondensedWGL Bold", "PreludeCondensedWGL Light", "PreludeCondensedWGL Medium", "PreludeWGL Black", "PreludeWGL Bold", "PreludeWGL Light", "PreludeWGL Medium", "Raavi", "Rachana", "Rockwell", "Rod", "Sakkal Majalla", "Sawasdee", "Script MT Bold", "Segoe Print", "Segoe Script", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol", "Segoe UI", "Shonar Bangla", "Showcard Gothic", "Shruti", "SimHei", "SimSun", "SimSun-ExtB", "Simplified Arabic Fixed", "Simplified Arabic", "Snap ITC", "Sylfaen", "Symbol", "Tahoma", "Times New Roman Baltic", "Times New Roman CE", "Times New Roman CYR", "Times New Roman Greek", "Times New Roman TUR", "Times New Roman", "TlwgMono", "Traditional Arabic", "Trebuchet MS", "Tunga", "Tw Cen MT Condensed Extra Bold", "Ubuntu", "Umpush", "Univers", "Utopia", "Utsaah", "Vani", "Verdana", "Vijaya", "Vladimir Script", "Vrinda", "Webdings", "Wide Latin", "Wingdings", "Arial", "Arial Black", "Bookman Old Style", "Calibri", "Cambria", "Cambria Math", "Century Gothic", "Comic Sans MS", "Consolas", "Courier New", "Georgia", "Impact", "Lucida Bright", "Lucida Console", "Lucida Fax", "Lucida Sans Unicode", "Microsoft Sans Serif", "MS Gothic", "MS PGothic", "MS Reference Sans Serif", "Palatino Linotype", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol", "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana", "Wingdings"]
          , n = "wwmmllii"
          , o = document.getElementsByTagName("body")[0]
          , i = document.createElement("div")
          , r = document.createElement("div")
          , a = {
            width: {},
            height: {}
        };
        function createSpan() {
            var e = document.createElement("span");
            return e.style.cssText = "position: absolute; left: -9999px; font-size: 72px; font-style: normal; font-weight: normal; letter-spacing: normal; line-break: auto; line-height: normal; text-transform: none; text-align: left; text-decoration: none; text-shadow: none; white-space: normal; word-break: normal; word-spacing: normal;",
            e.innerHTML = n,
            e
        }
        function createSpanWithFonts(e, t) {
            var n = createSpan();
            return n.style.fontFamily = "'" + e + "'," + t,
            n
        }
        function isFontAvailable(t) {
            for (var n = !1, o = 0; o < e.length; o++)
                if (n = t[o].offsetWidth !== a.width[e[o]] || t[o].offsetHeight !== a.height[e[o]])
                    return n;
            return n
        }
        try {
            var s = function initializeBaseFontsSpans() {
                for (var t = [], n = 0, o = e.length; n < o; n++) {
                    var r = createSpan();
                    r.style.fontFamily = e[n],
                    i.appendChild(r),
                    t.push(r)
                }
                return t
            }();
            o.appendChild(i);
            for (var c = 0, u = e.length; c < u; c++)
                a.width[e[c]] = s[c].offsetWidth,
                a.height[e[c]] = s[c].offsetHeight;
            var l = function initializeFontsSpans() {
                for (var n = {}, o = 0, i = t.length; o < i; o++) {
                    for (var a = [], s = 0, c = e.length; s < c; s++) {
                        var u = createSpanWithFonts(t[o], e[s]);
                        r.appendChild(u),
                        a.push(u)
                    }
                    n[t[o]] = a
                }
                return n
            }();
            o.appendChild(r);
            for (var d = [], g = 0, w = t.length; g < w; g++)
                isFontAvailable(l[t[g]]) && d.push(t[g]);
            return o.removeChild(r),
            o.removeChild(i),
            d
        } catch (e) {
            return window.AF_SDK.utils.logger("Font detector error: " + e),
            []
        }
    }
}
, function(e, t, n) {
    "use strict";
    e.exports = function() {
        var e = "[object Storage]" === Object.prototype.toString.call(window.localStorage);
        function missingKey(e) {
            e = arguments.length <= 0 || void 0 === arguments[0] ? null : arguments[0];
            return window.AF_SDK.utils.logger("Storage key is missing in localStorage", e),
            e || !0
        }
        function missingLocalService() {
            return window.AF_SDK.utils.logger("localStorage is not being supported by this browser")
        }
        return {
            getItem: e ? function(e, t) {
                return e || missingKey(t),
                function returnVal(e) {
                    return "[object String]" === Object.prototype.toString.call(e) && window.AF_SDK.utils.isJson(e) ? window.AF_SDK.utils.tcJSON(e, "parse") : e
                }(localStorage.getItem(e)) || function returnDefVal(e, t) {
                    return window.AF_SDK.utils.logger("The provided key [" + e + "] returned no value from localStorage, using default value:", t),
                    t || null
                }(e, t)
            }
            : missingLocalService,
            setItem: e ? function(e, t) {
                e || missingKey(),
                localStorage.setItem(e, "[object Object]" === Object.prototype.toString.call(t) ? window.AF_SDK.utils.tcJSON(t, "stringify") : t)
            }
            : missingLocalService,
            removeItem: e ? function(e) {
                e || missingKey(),
                localStorage.removeItem(e)
            }
            : missingLocalService,
            clearAll: e ? function() {
                localStorage.clear()
            }
            : missingLocalService
        }
    }()
}
, function(e, t, n) {
    "use strict";
    e.exports = function() {
        var e = "[object Storage]" === Object.prototype.toString.call(window.sessionStorage);
        function missingKey(e) {
            e = arguments.length <= 0 || void 0 === arguments[0] ? null : arguments[0];
            return window.AF_SDK.utils.logger("Storage key is missing in sessionStorage", e),
            e || !0
        }
        function missingLocalService() {
            return window.AF_SDK.utils.logger("sessionStorage Storage is not being supported by this browser")
        }
        return {
            getItem: e ? function(e, t) {
                return e || missingKey(t),
                function returnVal(e) {
                    return "[object String]" === Object.prototype.toString.call(e) && window.AF_SDK.utils.isJson(e) ? window.AF_SDK.utils.tcJSON(e, "parse") : e
                }(sessionStorage.getItem(e)) || function returnDefVal(e, t) {
                    return window.AF_SDK.utils.logger("The provided key [" + e + "] returned no value from sessionStorage, using default value:", t),
                    t || null
                }(e, t)
            }
            : missingLocalService,
            setItem: e ? function(e, t) {
                e || missingKey(),
                sessionStorage.setItem(e, "[object Object]" === Object.prototype.toString.call(t) ? window.AF_SDK.utils.tcJSON(t, "stringify") : t)
            }
            : missingLocalService,
            removeItem: e ? function(e) {
                e || missingKey(),
                sessionStorage.removeItem(e)
            }
            : missingLocalService,
            clearAll: e ? function() {
                sessionStorage.clear()
            }
            : missingLocalService
        }
    }()
}
, function(e, t, n) {
    "use strict";
    e.exports = function() {
        function isDocument() {
            return "undefined" == typeof document
        }
        function missingDocument() {
            window.AF_SDK.utils.logger("Document is missing in this browser")
        }
        function assign(e) {
            return Object.assign({
                path: "/"
            }, e, "number" == typeof e.expires ? {
                expires: new Date(1 * new Date + 864e5 * e.expires)
            } : {}, e.expires ? {
                expires: e.expires.toUTCString()
            } : {})
        }
        function encodeKey(e) {
            return encodeURIComponent(String(e)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape)
        }
        function decode(e) {
            return e.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
        }
        function stringifyAttributes(e) {
            var t = "";
            for (var n in e)
                e[n] && (t += "; " + n + "=" + e[n].split(";")[0]);
            return t
        }
        function convertType(e, t) {
            return window.AF_SDK.utils.isJson(e) ? window.AF_SDK.utils.tcJSON(e, t) : e
        }
        return {
            get: isDocument() ? missingDocument : function(e) {
                return function rescueCookie(e, t, n) {
                    t = arguments.length <= 1 || void 0 === arguments[1] ? null : arguments[1],
                    n = arguments.length <= 2 || !arguments[2] ? {} : arguments[2];
                    for (var o = 0, i = e.length; o < i; o++)
                        try {
                            var r = e[o].split("=")
                              , a = decode(r[0])
                              , s = convertType(decode(r[1]), "parse");
                            if (a === t)
                                return s;
                            t || (n[a] = s)
                        } catch (e) {
                            continue
                        }
                    return t && window.AF_SDK.utils.logger("[" + t + "] - Doesn't exist in stored cookies", e),
                    t ? null : n
                }(document.cookie ? document.cookie.split("; ") : [], e)
            }
            ,
            set: isDocument() ? missingDocument : function(e, t, n) {
                var o = convertType(t, "stringify");
                if (o)
                    return document.cookie = encodeKey(e) + "=" + function encodeVal(e) {
                        return encodeURIComponent(String(window.AF_SDK.utils.isJson(e) ? window.AF_SDK.utils.tcJSON(e, "stringify") : e)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent)
                    }(o) + stringifyAttributes(assign(n))
            }
            ,
            remove: isDocument() ? missingDocument : function(e) {
                return document.cookie = encodeKey(e) + "=" + stringifyAttributes(assign({
                    expires: -1
                }))
            }
        }
    }()
}
, function(e, t, n) {
    "use strict";
    e.exports = function() {
        function withBody(e) {
            return -1 !== ["POST", "PUT"].indexOf(e)
        }
        function ajax(e, t, n, o, i, r, a, s) {
            if (!t || !t.length)
                return window.AF_SDK.utils.logger("Cannot perform ajax request, request is missing url", arguments);
            var c = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
            c.open(e, withBody(e) ? t : t + function convertBodyToQuery(e) {
                var t = "?";
                for (var n in e)
                    Object.hasOwnProperty(n) && (t += n + "=" + e[n] + "&");
                return t.slice(0, -1)
            }(o), !0),
            c.timeout = i,
            c.withCredentials = r,
            function setHeaders(e, t, n) {
                Object.keys(Object.assign(t, withBody(n) ? {
                    "Content-type": "text/plain"
                } : {})).forEach(function(n) {
                    e.setRequestHeader(n, t[n])
                })
            }(c, n, e),
            c.onreadystatechange = function() {
                return 4 !== c.readyState ? {
                    status: c.status,
                    text: c.statusText
                } : c.status >= 200 && c.status < 400 ? a && a({
                    status: c.status,
                    data: (e = c.responseText,
                    "[object Object]" === Object.prototype.toString.call(e) ? e : window.AF_SDK.utils.tcJSON(e, "parse")),
                    getHeaders: c.getAllResponseHeaders()
                }) : s && s({
                    status: c.status,
                    text: c.statusText
                });
                var e
            }
            ,
            withBody(e) ? c.send(JSON.stringify(o)) : c.send(),
            c.ontimeout = function() {
                return window.AF_SDK.utils.logger("Ajax request was failed because of timeout", Object.assign({}, arguments, {
                    status: c.status,
                    data: c.responseText
                }))
            }
            ,
            c.onerror = function() {
                return window.AF_SDK.utils.logger("Ajax request was failed because of error", Object.assign({}, arguments, {
                    status: c.status,
                    data: c.responseText
                }))
            }
            ,
            c.onabort = function() {
                return window.AF_SDK.utils.logger("Ajax request was failed because of abort action", Object.assign({}, arguments, {
                    status: c.status,
                    data: c.responseText
                }))
            }
        }
        return function() {
            var e = arguments[0] || {}
              , t = e.hasOwnProperty("method") ? e.method : "POST"
              , n = e.hasOwnProperty("url") ? e.url : null
              , o = e.hasOwnProperty("headers") ? e.headers : {}
              , i = e.hasOwnProperty("body") ? e.body : null
              , r = e.hasOwnProperty("timeout") ? e.timeout : 1e4
              , a = !e.hasOwnProperty("withCredentials") || e.withCredentials
              , s = e.hasOwnProperty("cb") ? e.cb : null
              , c = e.hasOwnProperty("fail") ? e.fail : null;
            return s || c || !navigator.sendBeacon ? ajax(t, n, o, i, r, a, s, c) : function beacon(e, t) {
                return navigator.sendBeacon(e, JSON.stringify(t))
            }(n, i)
        }
    }()
}
]);
