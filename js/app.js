/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "7d471647a97ad35970f8"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(Object.defineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(Object.defineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "js/";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	console.log('app.js has loaded!');

	;(function($) {
	  "use strict";

	    var compatibility = __webpack_require__(2);

	  //------------loader-------------
	    $(document).ready(function() {
	      $('.loader').show();
	      $('.navbar-fixed-top').hide();
	    });

	    // $(window).load(function() {
	    //   $('.loader').hide();
	    //   $('.navbar-fixed-top').show();
	    // });
	  $(document).on('click', '.close-modal', function() {
	    $('#contact-us-modal').fadeOut(200);
	    $('.modal-backdrop ').fadeOut(200);
	  });

	  window.onload = function() {
	    $('.loader').hide();
	    $('.navbar-fixed-top').show();

	    $('#contact-us-modal form').submit(function() {
	      $('#contact-us-modal .modal-title').text('Thank you!');
	      $('#contact-us-modal .modal-header > p').text('You\'ve requested call back.');
	      $('#contact-us-modal .modal-dialog').height(250);
	      $('#contact-us-modal .modal-dialog .modal-content').height(250);
	      $('#contact-us-modal .modal-footer button[type="submit"]').val('OK').text('OK').addClass('close-modal');
	      $(this).find('.input-group').fadeOut(200);
	      setTimeout(function() {
	        $('#contact-us-modal').fadeOut(200);
	        $('.modal-backdrop ').fadeOut(200);
	      }, 3000);

	      return false;
	    });
/*
	    $('#subscribe-form').submit(function() {
	      $('#subscribe-modal').addClass('in').fadeIn(200);
	      $('.modal-backdrop').fadeIn(200);
	      $('#subscribe-modal .modal-dialog').height(250);
	      $('#subscribe-modal .modal-dialog .modal-content').height(250);
	      setTimeout(function() {
	        $('#subscribe-modal').fadeOut(200);
	        $('.modal-backdrop ').fadeOut(200);
	      }, 3000);

	      return false;
	    });
*/
	    $('#subscribe-modal button').click(function() {
	      $('#subscribe-modal').fadeOut(200);
	      $('.modal-backdrop ').fadeOut(200);
	      return false;
	    });

	    $('.phone-mask').inputmask({
	      mask: "+61 (99) 9999-9999",
	      clearMaskOnLostFocus: false
	    });
	    $('.credit-mask').inputmask({
	      mask: "9999-9999-9999-9999",
	      clearMaskOnLostFocus: false
	    });
	  };
	  //------------loader-------------
	  $(document).ready(function () {
	    compatibility();

	    var screens = $('.screen'),
	      youButtonMenu = $('.you-button-menu'),
	      settingPage = $('.setting-page'),
	      screenBlackout = $('.screen-blackout'),
	      btnPageChange = $('.btn-page-change'),
	      pageChangeBullets = $('.page-change-bullets'),
	      teamParallax1 = $('#team-parallax-part-1'),
	      teamParallax2 = $('#team-parallax-part-2');

	    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
	      var mobile = true;
	    }

	    $('#contact-us-modal').on('shown.bs.modal', function () {
	      $('#myInput').focus();
	    });

	    $('#change-page-button').on('click', function () {
	      if (settingPage.hasClass('open-menu')) {
	        settingPage.removeClass('open-menu');
	        screenBlackout.hide();
	        btnPageChange.removeClass('open-menu').parent().parent().find('a h4').removeClass('hidden');
	        pageChangeBullets.hide();
	        teamParallax1.attr('style', 'z-index: 1;');
	      } else {
	        settingPage.addClass('open-menu');
	        screenBlackout.show();
	        teamParallax1.attr('style', 'z-index: -1;');
	        $('.screen-change-bullets').removeClass('open-menu');
	        for (var k = 0; k < contentPart.length; k++) {
	          contentPart[k].classList.add('shown-section');
	          $(this).find('svg').drawsvg('animate', {duration: 2500}).addClass('painted');
	        }
	      }
	    });

	    $(screenBlackout).on('click', function() {
	      if (settingPage.hasClass('open-menu')) {
	        settingPage.removeClass('open-menu');
	        screenBlackout.hide();
	        btnPageChange.removeClass('open-menu').parent().parent().find('a h4').removeClass('hidden');
	        pageChangeBullets.hide();
	        teamParallax1.attr('style', 'z-index: 1;');
	      }
	    });

	    $('.page-change-bullets li a').on('click', function () {
	      settingPage.removeClass('open-menu');
	      screenBlackout.hide();
	    });

	    $('.page-menu').on('click','a', function (event) {
	      event.preventDefault();
	      var id  = $(this).attr('href'),
	        top = $(id).offset().top;
	      $('body, html').animate({scrollTop: top}, 500);
	    });

	    screens.map(function (index, screens) {
	      $('#btn-' + index + '-change').on('click', function () {
	        var screenIndexChange = $('#screen-' + index + '-change');
	        if (screenIndexChange.hasClass('open-menu')) {
	          screenIndexChange.removeClass('open-menu');
	          screenBlackout.hide();
	          teamParallax1.attr('style', 'z-index: 1;');
	        } else {
	          screenBlackout.show();
	          settingPage.removeClass('open-menu');
	          btnPageChange.removeClass('open-menu').parent().parent().find('a h4').removeClass('hidden');
	          pageChangeBullets.hide();
	          teamParallax1.attr('style', 'z-index: -1;');
	          $('#screen-' + index + '-change').addClass('open-menu')
	            .find(".btn-screen-bullet").on('click', function () {
	            screenBlackout.hide();
	            teamParallax1.attr('style', 'z-index: 1;');
	            screenIndexChange.removeClass('open-menu').find('.active-bullets').removeClass('active-bullets');
	            var activeNmb = $(this)[0].dataset.number,
	              screenSetting = [$('.screen')];//changes
	            screenSetting.forEach(function (screen) {
	              if (index === 1) {
	                var headerScreen = $('.header-screen'),
	                  screenFuture = $('.screen-future'),
	                  headerParallax = $('.header-parallax'),
	                  productParallax = $('.product-parallax'),
	                  headerStaticParallax = $('.header-static-parallax'),
	                  videoContainer = $('.video-container'),
	                  video = document.getElementById('home-video');
	                if (activeNmb === '1') {
	                  // headerScreen.removeClass().addClass('parallax').addClass('header-screen');
	                  $('.header-screen.static').addClass('hidden');
	                  $('.header-screen.parallax').removeClass('hidden video');
	                  $('.header-image').attr('src', './images/header-image.png');
	                  screenFuture.removeAttr('style', 'background');
	                  videoContainer.hide();
	                  headerParallax.show();
	                  headerStaticParallax.hide();
	                } else if (activeNmb === '0') {
	                  $('.header-screen.parallax').addClass('hidden').removeClass('video');
	                  $('.header-screen.static').removeClass('hidden');
	                  $('.white.screen-future .static .header-image').attr('src', './images/header-static.png');
	                  $('.darkGray.screen-future .static .header-image').attr('src', './images/header-static-black.png');
	                  /*screenFuture.attr('style', 'background:url("./images/future-parallax-bg.jpg") no-repeat');*/
	                  screenFuture.removeAttr('style', 'background');
	                  videoContainer.hide();
	                  headerParallax.hide();
	                  headerStaticParallax.show();
	                } else {
	                  $('.header-screen').eq(0).addClass('hidden');
	                  $('.header-screen').eq(1).removeClass('hidden').addClass('video');
	                  videoContainer.show();
	                  headerParallax.hide();
	                  headerStaticParallax.hide();
	                  screenFuture.attr('style', 'background: rgba(0,0,0,0.5)');
	                  video.load();
	                  video.play();
	                }
	              } else if (index === 8) {
	                var teamScreen = ['ellipse', 'square', 'triangle'],
	                  teamPart1 = $('#team-part-1'),
	                  teamPart2 = $('#team-part-2'),
	                  changeTeam = $('.changes-screen-8');
	                if (activeNmb === '1') {
	                  changeTeam.attr('id',teamScreen[1]);
	                  $('.photo-team').map(function (i, photo) {
	                    var number = i + 1;
	                    $(this).find('.team-' + number).attr('src', './images/photo/2_team_' + teamScreen[1] + '_' + number + '.png').removeClass().addClass('team-' + number + ' ' + teamScreen[1] + '-team-photo');
	                  });
	                  $('.square-background').show();
	                  $('.ellipse-background').hide();
	                  $('.triangle-background').hide();
	                  if (screen.hasClass('white')) {
	                    teamPart1.removeClass().addClass('team-parallax-' + teamScreen[1] + '-1-white');
	                    teamPart2.removeClass().addClass('team-parallax-' + teamScreen[1] + '-2-white');
	                    $('.border-team').attr('src', './images/photo/all_team_' + teamScreen[1] + '_for_white.png');
	                  } else {
	                    teamPart1.removeClass().addClass('team-parallax-' + teamScreen[1] + '-1-black');
	                    teamPart2.removeClass().addClass('team-parallax-' + teamScreen[1] + '-2-black');
	                    $('.border-team').attr('src', './images/photo/all_team_' + teamScreen[1] + '_for_black.png');
	                  }
	                } else if (activeNmb === '0') {
	                  changeTeam.attr('id',teamScreen[0]);
	                  $('.photo-team').map(function (i, photo) {
	                    var number = i + 1;
	                    $(this).find('.team-' + number).attr('src', './images/photo/3_team_' + teamScreen[0] + '_' + number + '.png').removeClass().addClass('team-' + number + ' ' + teamScreen[0] + '-team-photo');
	                  });
	                  $('.ellipse-background').show();
	                  $('.triangle-background').hide();
	                  $('.square-background').hide();
	                  if (screen.hasClass('white')) {
	                    teamPart1.removeClass().addClass('team-parallax-' + teamScreen[0] + '-1-white');
	                    teamPart2.removeClass().addClass('team-parallax-' + teamScreen[0] + '-2-white');
	                    $('.border-team').attr('src', './images/photo/all_team_' + teamScreen[0] + '_for_white.png');
	                  } else {
	                    teamPart1.removeClass().addClass('team-parallax-' + teamScreen[0] + '-1-black');
	                    teamPart2.removeClass().addClass('team-parallax-' + teamScreen[0] + '-2-black');
	                    $('.border-team').attr('src', './images/photo/all_team_' + teamScreen[0] + '_for_black.png');
	                  }
	                } else {
	                  changeTeam.attr('id',teamScreen[2]);
	                  $('.photo-team').map(function (i, photo) {
	                    var number = i + 1;
	                    $(this).find('.team-' + number).attr('src', './images/photo/1_team_' + teamScreen[2] + '_' + number + '.png').removeClass().addClass('team-' + number + ' ' + teamScreen[2] + '-team-photo');
	                  });
	                  $('.triangle-background').show();
	                  $('.square-background').hide();
	                  $('.ellipse-background').hide();
	                  if (screen.hasClass('white')) {
	                    teamPart1.removeClass().addClass('team-parallax-' + teamScreen[2] + '-1-white');
	                    teamPart2.removeClass().addClass('team-parallax-' + teamScreen[2] + '-2-white');
	                    $('.border-team').attr('src', './images/photo/all_team_' + teamScreen[2] + '_for_white.png');
	                  } else {
	                    teamPart1.removeClass().addClass('team-parallax-' + teamScreen[2] + '-1-black');
	                    teamPart2.removeClass().addClass('team-parallax-' + teamScreen[2] + '-2-black');
	                    teamParallax1.attr('style', 'z-index: 1;');
	                    $('.border-team').attr('src', './images/photo/all_team_' + teamScreen[2] + '_for_black.png');
	                  }
	                }
	              } else {
	                var screenChange = [$('.changes-screen-' + index)];
	                screenChange.forEach(function (active) {
	                  for (var j = 0; j < active.length; j++) {
	                    var itemClass = active[j].classList;
	                    active[j].classList.remove('active-screen');
	                    active[j].classList.add('hidden-screen');
	                  }
	                  active[activeNmb].classList.add('active-screen');
	                  active[activeNmb].classList.remove('hidden-screen');
	                  if (index === 7) {
	                    if (activeNmb === '2') {
	                      $('.reviews').attr('style', 'background: #f2f2f2');
	                    } else {
	                      $('.reviews').attr('style', 'background: url("../images/reviews-three-bg.jpg")');
	                    }
	                  }
	                  if (index === 9) {
	                    var timeLine = [$('#horizontal-timeline-next'), $('#vertical-timeline-next')];
	                    if (activeNmb === '1') {
	                      timeLine = timeLine[0];
	                    } else {
	                      timeLine = timeLine[1];
	                    }
	                    //------SHOW AND HIDE TIMELINE-------------
	                    timeLine.find('.ellipse-click').on('click', function () {
	                      $(this).hide();
	                      $(this).parent().find('.cd-timeline-content').show();
	                      if (activeNmb === '1') {
	                        $(this).parent().addClass('cd-timeline-block-open');
	                        $(this).parent().removeClass('cd-timeline-block-close');
	                      }
	                    });
	                    timeLine.find('.ellipse').on('click', function () {
	                      $(this).parent().hide();
	                      $(this).parent().parent().find('.ellipse-click').show();
	                      if (activeNmb === '1') {
	                        $(this).parent().parent().removeClass('cd-timeline-block-open');
	                        $(this).parent().parent().addClass('cd-timeline-block-close');
	                      }
	                    });
	                    //------END SHOW AND HIDE TIMELINE-------------
	                  }
	                  if (index === 10) {
	                    if (activeNmb === '1') {
	                      // $('.app').attr('style', 'background: #f2f2f2');
	                      $('.app-parallax').show();
	                      $('.app-noparallax').hide()
	                    } else {
	                      // $('.app').attr('style', 'background:url("./images/standart-app-bg.jpg") no-repeat');
	                      $('.app-parallax').hide();
	                      $('.app-noparallax').show()
	                    }
	                  }
	                });
	              }
	            });
	            $(this).addClass('active-bullets');
	          });
	        }
	      });
	    });

	    //------ change color for collection-modal
	    var collectionModalColor = '';
	    $('.choose-btn a').on('click', function () {
	      $('.change-color').removeClass('active');
	      if ($(this).attr('id') === 'small-collection-1' || $(this).attr('id') === 'collection-1'|| $(this).attr('id') === 'collection-one-1') {
	        collectionModalColor = 'black';
	        $('#modal-collection-1').addClass('active');
	      } else if ($(this).attr('id') === 'small-collection-2' || $(this).attr('id') === 'collection-2' || $(this).attr('id') === 'collection-one-2') {
	        collectionModalColor = 'whites';
	        $('#modal-collection-2').addClass('active');
	      } else if ($(this).attr('id') === 'small-collection-3' || $(this).attr('id') === 'collection-3' || $(this).attr('id') === 'collection-one-3') {
	        collectionModalColor = 'blue';
	        $('#modal-collection-3').addClass('active');
	      } else {
	        collectionModalColor = 'pink';
	        $('#modal-collection-4').addClass('active');
	      }
	      $('.modal-first').attr('src','./images/collection-screen/modal-'+ collectionModalColor +'-first.png');
	      $('.modal-second').attr('src','./images/collection-screen/modal-'+ collectionModalColor +'-second.png');
	      $('.md-modal-first').attr('src','./images/collection-screen/md-modal-'+ collectionModalColor +'-first.png');
	      $('.md-modal-second').attr('src','./images/collection-screen/md-modal-'+ collectionModalColor +'-second.png');
	      $('.xs-modal-first').attr('src','./images/collection-screen/xs-modal-'+ collectionModalColor +'-first.png');
	      $('.xs-modal-second').attr('src','./images/collection-screen/xs-modal-'+ collectionModalColor +'-second.png');
	    });
	    $('#collection-modal').on('shown.bs.modal', function () {
	      var moreText = $('.more-text');
	      moreText.parent().removeClass('full-text');
	      $('.change-color').on('click', function () {
	        $('.change-color').removeClass('active');
	        $(this).addClass('active');
	        if ($(this).attr('id') === 'modal-collection-1') {
	          collectionModalColor = 'black';
	        } else if ($(this).attr('id') === 'modal-collection-2') {
	          collectionModalColor = 'whites';
	        } else if ($(this).attr('id') === 'modal-collection-3') {
	          collectionModalColor = 'blue';
	        } else {
	          collectionModalColor = 'pink';
	        }
	        $('.modal-first').attr('src','./images/collection-screen/modal-'+ collectionModalColor +'-first.png');
	        $('.modal-second').attr('src','./images/collection-screen/modal-'+ collectionModalColor +'-second.png');
	        $('.md-modal-first').attr('src','./images/collection-screen/md-modal-'+ collectionModalColor +'-first.png');
	        $('.md-modal-second').attr('src','./images/collection-screen/md-modal-'+ collectionModalColor +'-second.png');
	        $('.xs-modal-first').attr('src','./images/collection-screen/xs-modal-'+ collectionModalColor +'-first.png');
	        $('.xs-modal-second').attr('src','./images/collection-screen/xs-modal-'+ collectionModalColor +'-second.png');
	      });
	      moreText.on('click', function () {
	        $(this).parent().removeClass('short-text').addClass('full-text');
	      });
	    });
	    //------ end change color for collection-modal

	    //-----DRAW ANIMATE SVG------------

	    var svgIcon = $('svg');
	    var $svg = svgIcon.drawsvg({duration: 2500});
	    svgIcon.appear();
	    screens.on('appear', 'svg', function (e, $affected) {
	      if (!$(this).hasClass('painted')) {
	        $(this).drawsvg('animate', {duration: 2500}).addClass('painted');
	        /*setTimeout(function () {
	         $('.painted').find('g').attr('fill-opacity', 1);
	         }, 5000);*/
	        if (mobile) {
	          $('.steps').find('svg').drawsvg('animate', {duration: 2500}).addClass('painted');
	        }
	      }
	    });
	    //-----END DRAW ANIMATE SVG------------

	    //----------PARALLAX---------
	    var parallaxOptions = {
	      calibrateX: false,
	      calibrateY: false,
	      invertX: true,
	      invertY: true,
	      limitX: 200,
	      limitY: 100,
	      scalarX: 8,
	      scalarY: 8,
	      frictionX: 0.2,
	      frictionY: 0.2
	    };
	    $('#header-parallax').parallax(parallaxOptions);
	    $('#product-parallax').parallax(parallaxOptions);
	    $('#app-parallax').parallax(parallaxOptions);
	    $('#app-noparallax').parallax(parallaxOptions);
	    teamParallax1.parallax(parallaxOptions);
	    $('#team-parallax-part-2').parallax(parallaxOptions);
	    $('#review-parallax').parallax(parallaxOptions);
	    //----------PARALLAX END---------

	    //----------MARK CONTENT---------
	    // var timeout_handles = [];
	    $('.mark').on('click', function () {
	      if ($(this).hasClass('active')) {
	        $(this).removeClass('active');
	        $(this).find('.plus').show();
	        $(this).find('.content').hide();
	      } else {
	        var element = $(this);
	        $(this).addClass('active');
	        $(this).find('.plus').hide();
	        $(this).find('.content').show();
	        setTimeout(function () {
	          element.removeClass('active')
	            .find('.plus').show()
	            .find('.content').hide();

	        }, 5000);
	      }
	    });
	    //---------END MARK CONTENT----------

	    //-----ANIMATE OBJECT-------------
	    var heightsFromTop = [];
	    var contentPart = document.getElementsByClassName('hidden-section');
	    setTimeout(function () {
	      if (($(window).scrollTop()) !== 0) {
	        for (var k = 0; k < contentPart.length; k++) {
	          contentPart[k].classList.add('shown-section');
	          $(this).find('svg').drawsvg('animate', {duration: 2500}).addClass('painted');
	        }
	        /*setTimeout(function () {
	         $('.painted').find('g').attr('fill-opacity', 1);
	         }, 5000);*/
	      }
	    }, 1000);
	    for (var i = 0; i < contentPart.length; i++) {
	      heightsFromTop.push(contentPart[i].offsetTop - 800);
	    }
	    var j = 0;
	    $(window).scroll(function () {
	      if ($(window).scrollTop() > heightsFromTop[j]) {
	        contentPart[j].classList.add('shown-section-animated');
	        j++;
	      }
	    });
	    //----END Animate Object---

	    $('.scroll').on('click', 'a', function (event) {
	      event.preventDefault();
	      for (var k = 0; k < contentPart.length; k++) {
	        contentPart[k].classList.add('shown-section');
	        // $(this).find('svg').drawsvg('animate', {duration: 5000}).addClass('painted');
	      }
	      var id = $(this).attr('href'),
	        top = $(id).offset().top;
	      $('body,html').animate({scrollTop: top - 64}, 500);

	    });

	    //----------VIEW CHANGE BULLETS---------
	    btnPageChange.on('click', function () {
	      if ($(this).hasClass('open-menu')) {
	        $(this).removeClass('open-menu').find('.page-change-bullets').hide();
	        $(this).parent().parent().find('a h4').removeClass('hidden');
	      } else {
	        btnPageChange.removeClass('open-menu').parent().parent().find('a h4').removeClass('hidden');
	        pageChangeBullets.hide();
	        $(this).addClass('open-menu');
	        $(this).find('.page-change-bullets').show();
	        $(this).find('a h4').addClass('hidden');
	      }
	    });
	    pageChangeBullets.find('.btn-screen-change').on('click', function () {
	      $(this).parent().parent().find('a h4').removeClass('hidden');
	      pageChangeBullets.hide();
	    });
	    //---------END VIEW CHANGE BULLETS----------


	    //----ADD ANIMATION FOR screen-future-----
	    var screenFuture = $('.screen-future');
	    screenFuture.find('img').attr('style', 'animation: rightAnim 0.3s ease-in 0.8s both;');
	    screenFuture.find('h1').attr('style', 'animation: rightAnim 0.3s ease-in 0.6s both;');
	    screenFuture.find('p').attr('style', 'animation: rightAnim 0.3s ease-in 1s both;');
	    screenFuture.find('a').attr('style', 'animation: rightAnim 0.3s ease-in 0.4s both;');
	    /*screenFuture.find('svg').drawsvg('animate').addClass('painted');*/
	    youButtonMenu.find('svg').drawsvg('animate', {duration: 1}).addClass('painted');
	    $('.change-page').find('svg').drawsvg('animate', {duration: 1}).addClass('painted');
	    $('.change-screen').find('svg').drawsvg('animate', {duration: 1}).addClass('painted');
	    $('#scroll-down').attr('style', 'animation: scroll-cta 2s infinite !important;').find('svg').drawsvg('animate', {duration: 1}).addClass('painted');
	    /*$('.painted').find('g').attr('fill-opacity', 1);*/
	    //----END ANIMATION FOR screen-future-----

	    //----ADD SRC-------
	    /*$('#mobile-webm').attr('src', 'http://s3.bravepeople.co/assets/media/process-loop.webm');
	     $('#mobile-mp4').attr('src', 'http://s3.bravepeople.co/assets/media/process-loop.mp4');*/

	    /*$('#stock-photo').attr('src', './images/stock-photo-man.png');
	     $('#photo-man').attr('src', './images/photo-man.png');*/
	    //-----END SRC-------

	    function changeTeam(team, color) {
	      teamParallax1.attr('style', 'z-index: 1;');
	      $('#team-part-1').removeClass().addClass('team-parallax-'+ team +'-1-'+ color);
	      $('#team-part-2').removeClass().addClass('team-parallax-'+ team +'-2-'+ color);
	      $('.border-team').attr('src', './images/photo/all_team_' + team + '_for_'+ color +'.png');
	      /*teamParallax2.toggleClass('darkGray');*/
	      $('#mobile-mp4').attr('src', './video/BG_for_'+ color +'_theme.mp4');
	      if ($('.header-screen').hasClass('video')) {
	        document.getElementById('home-video').load();
	        document.getElementById('home-video').play();
	      }
	    }

	    //-----CHANGE COLOR THEME----------
	    $('#darkGray').on('click', function () {
	      $('.white').map(function (i, screens) {
	        if ($(this).hasClass('white')) {
	          $(this).addClass('darkGray').removeClass('white');
	          $('.animation').find('img').attr('src', './images/dark-arrow.png');
	        }
	      });
	      changeTeam($('.changes-screen-8').attr('id') , 'black');
	      $('.darkGray.screen-future .static .header-image').attr('src', './images/header-static-black.png');
	      $('.darkGray.more-product #stock-basic-more-product .photo img').attr('src', './images/more-product-screen/stock-photo-man-black.png');
	      $('.darkGray.more-product #basic-more-product .photo img').attr('src', './images/more-product-screen/photo-man-black.png');
	    });
	    $('#white').on('click', function () {
	      $('.darkGray').map(function (i, screens) {
	        if ($(this).hasClass('darkGray')) {
	          $(this).addClass('white').removeClass('darkGray');
	          $('.animation').find('img').attr('src', './images/arrow.png');
	        }
	      });
	      changeTeam($('.changes-screen-8').attr('id') , 'white');
	      $('.white.screen-future .static .header-image').attr('src', './images/header-static.png');
	      $('.white.more-product #stock-basic-more-product .photo img').attr('src', './images/more-product-screen/stock-photo-man.png');
	      $('.white.more-product #basic-more-product .photo img').attr('src', './images/more-product-screen/photo-man.png');
	    });
	    //-----END CHANGE COLOR THEME----------

	    // function scrolliFy(scrollSpeed) {
	    //     $.scrollify({
	    //         section: ".one-screen",
	    //         //sectionName:false,
	    //         scrollSpeed: scrollSpeed,
	    //         easing: "easeOutExpo",
	    //         offset: -64,
	    //         setHeights: false,
	    //         overflowScroll: true,
	    //         after: function (i) {
	    //         }
	    //     });
	    // }
	    //
	    // //------SLOW SCROLLING-----------------------
	    // $('#scrolling-bullet').on('click', 'a', function () {
	    //     var duration = 1;
	    //     if (($(this)[0].dataset.number === '1')) {
	    //         scrolliFy(1500);
	    //         $('.change-screen').attr('style', 'bottom: 121px;');
	    //         screenFuture.find('.change-screen').removeAttr('style');
	    //         duration = 1500;
	    //         $('.scroll').on('click', 'a', function (event) {
	    //             event.preventDefault();
	    //             var id = $(this).attr('href'),
	    //                 top = $(id).offset().top;
	    //             $('body,html').animate({scrollTop: top - 64}, 1500);
	    //         });
	    //     } else {
	    //         $.scrollify.destroy();
	    //         screens.removeAttr('style');
	    //         $('.change-screen').removeAttr('style');
	    //         $('.scroll').off('click', 'a', function (event) {
	    //             event.preventDefault();
	    //         });
	    //     }
	    //
	    // });
	    // //------END SLOW SCROLLING-----------------------
	    //
	    // //---------scroll-----
	    // $('#one-screen-bullet').on('click', 'a', function () {
	    //     if (($(this)[0].dataset.number === '1')) {
	    //         scrolliFy(1000);
	    //         $('html').addClass('noScrollBar');
	    //         $('.change-screen').attr('style', 'bottom: 121px;');
	    //         screenFuture.find('.change-screen').removeAttr('style');
	    //     } else {
	    //         $.scrollify.destroy();
	    //         $('html').removeClass();
	    //         screens.removeAttr('style');
	    //         $('.change-screen').removeAttr('style');
	    //     }
	    // });
	    // //--------scroll-------------

	    var timeLine = $('#vertical-timeline-next');
	    timeLine.find('.ellipse-click').on('click', function () {
	      $(this).hide();
	      $(this).parent().find('.cd-timeline-content').show();

	    });
	    timeLine.find('.ellipse').on('click', function () {
	      $(this).parent().hide();
	      $(this).parent().parent().find('.ellipse-click').show();
	    });

	    //------ add swipe carousel --------
	    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
	      var carousels = $(".carousel");
	      carousels.carousel();
	      carousels.map(function (i, carousel) {
	        $(this).carousel({
	          swipe: 30
	        });
	      });
	    }
	    else {
	      return false;
	    }
	    //------ end add swipe carousel --------


	  });

	  function scrollBlogSections() {
	    //------- BLOG SECTIONS ----------
	    if ( $(window).width() > 767 ) {
	      var section = $(".blog-section");
	      var sectionTop = [];
	      var sectionBottom = [];
	      var sectionHeight = [];

	      for ( var index = 0; index < section.length; index++ ) {
	        sectionTop.push(section[index].offsetTop);
	        sectionBottom.push(section[index].offsetTop + section[index].clientHeight + 60);
	        sectionHeight.push(section[index].clientHeight + 60);
	      }
	      sectionBottom[0] -= 60;
	      sectionHeight[0] -= 60;
	      var s = 0;
	      var scrollTop = $(window).scrollTop() + 80;
	      if ( scrollTop > sectionTop[0] ) {
	        for ( var indexLenth = 1; indexLenth < section.length; indexLenth++ ) {
	          if ( scrollTop > sectionTop[indexLenth] ) {
	            s++;
	          }
	        }
	        for ( var number = 0; number < s; number++ ) {
	          section.find(".section-name-bold")[s].style.position = 'relative';
	          section.find(".section-name-bold")[s].style.top = sectionHeight[s] - 42 + 'px';
	        }
	        section.find(".section-name-bold")[s].style.position = 'fixed';
	        section.find(".section-name-bold")[s].style.top = 80 + 'px';
	      }
	      $(window).scroll(function() {
	        if ( s < 0 ) {
	          s = 0;
	        }
	        var tmpScrollTop = $(window).scrollTop() + 80;

	        if ( tmpScrollTop > scrollTop ) {

	          if ( tmpScrollTop > sectionTop[s] ) {
	            section.find(".section-name-bold")[s].style.position = 'fixed';
	            section.find(".section-name-bold")[s].style.top = 80 + 'px';
	          }
	          if ( s === 0 ) {
	            if ( tmpScrollTop > sectionBottom[s] - 102 ) {
	              section.find(".section-name-bold")[s].style.position = 'relative';
	              section.find(".section-name-bold")[s].style.top = sectionHeight[s] - 102 + 'px';
	              s++;
	            }
	          } else {
	            if ( tmpScrollTop > sectionBottom[s] - 102 - 40 ) {
	              section.find(".section-name-bold")[s].style.position = 'relative';
	              section.find(".section-name-bold")[s].style.top = sectionHeight[s] - 142 + 'px';
	              s++;
	            }
	          }
	        }
	        else if ( tmpScrollTop < scrollTop ) {

	          if ( s === 0 ) {
	            if ( tmpScrollTop > sectionBottom[s] - 102 ) {
	              section.find(".section-name-bold")[s].style.position = 'relative';
	              section.find(".section-name-bold")[s].style.top = sectionHeight[s] - 102 + 'px';
	              s++;
	            }
	          } else {
	            if ( tmpScrollTop > sectionBottom[s] - 102 - 40 ) {
	              section.find(".section-name-bold")[s].style.position = 'relative';
	              section.find(".section-name-bold")[s].style.top = sectionHeight[s] - 142 + 'px';
	              s++;
	            }
	          }
	          if ( s === 0 ) {
	            if ( tmpScrollTop < sectionBottom[s] - 102 ) {
	              section.find(".section-name-bold")[s].style.position = 'fixed';
	              section.find(".section-name-bold")[s].style.top = 80 + 'px';
	            }
	            if ( tmpScrollTop < sectionTop[s] ) {
	              section.find(".section-name-bold")[s].style.position = 'relative';
	              section.find(".section-name-bold")[s].style.top = 0;
	              s--;
	            }
	          } else {
	            if ( tmpScrollTop < sectionBottom[s] - 102 - 40 ) {
	              section.find(".section-name-bold")[s].style.position = 'fixed';
	              section.find(".section-name-bold")[s].style.top = 80 + 'px';
	            }
	            if ( tmpScrollTop < sectionTop[s] ) {
	              section.find(".section-name-bold")[s].style.position = 'relative';
	              section.find(".section-name-bold")[s].style.top = 0;
	              s--;
	            }
	          }
	        }
	        scrollTop = tmpScrollTop;
	      });
	    } else {
	      $('.blog-section .section-name-bold').css({
	        'position': 'relative',
	        'top': 0
	      });
	      $(window).scroll(function() {
	        $('.blog-section .section-name-bold').css({
	          'position': 'relative',
	          'top': 0
	        });
	      });
	      return false;
	    }
	  }
	  if ($('.main-container-wrapper').hasClass('blog-page')) {
	    scrollBlogSections();
	    $(window).resize(function() {
	      scrollBlogSections();
	    });
	  }
	  // setTimeout(function () {
	  //
	  // }, 1000);

	  if ($('.main-container-wrapper').hasClass('single-blog-page')) {
	    $('.comment-reply-btn').on('click', function () {
	      $(this).addClass('click');
	      var btn = $(this);

	      var id = btn.attr('href'),
	        top = $(id).offset().top;

	      $('body,html').animate({scrollTop: top - 64}, 1);

	      $('textarea[name=comment]').eq(0).val('Reply to ' + btn.parent().find('.comment-person-name')[0].innerHTML);

	    });

	    //---------ADD COMMENTS-------------
	    $("#comment-form").submit(function (event) {
	      var name = $('input[name=Name]').val(),
	        nameImage = name.split(''),
	        email = $('input[name=email]').val(),
	        text = $('textarea[name=comment]').val(),
	        currentDate = new Date(),
	        datetime = currentDate.getDate() + "." + (currentDate.getMonth() + 1) + "." + currentDate.getFullYear(),
	        clickBtn = $('.click');

	      event.preventDefault();

	      if (text.split(" ")[0] === 'Reply') {
	        var replay = clickBtn.parent().find('.comment-person-name')[0].innerHTML;
	        clickBtn.parents('.comment-block').after($(' <div class="comment-block comment-reply"> <div class="container"> <div class="col-lg-12 col-lg-offset-0 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 no-padding"> <div class="col-lg-4 col-lg-offset-1 col-md-5 col-md-offset-1 col-sm-6 col-sm-offset-1 col-xs-11 col-xs-offset-1 row"> <div class="comment-person"> <div class="col-lg-5 col-md-6 col-sm-5 col-xs-6 row"> <div class="comment-avatar"><h2>' + nameImage[0] + '</h2></div> <!--end comment-avatar--> </div> <!--end col-lg-5 col-md-6--> <div class="col-lg-7 col-md-6 col-sm-7 col-xs-6 no-padding"> <div class="comment-data"> <p class="comment-person-name">' + name + '</p> <p class="comment-time">' + datetime + '</p> <a class="comment-reply-btn" href="#comments">Reply to ' + name + '</a> </div> <!--end comment-data--> </div> <!--end col-lg-7 col-md-6--> </div> <!--end comment-person--> </div> <!--end col-lg-4 col-lg-offset-1--> <div class="col-lg-7 col-lg-offset-0 col-md-6 col-md-offset-0 col-sm-5 col-sm-offset-0 col-xs-7 col-xs-offset-5 no-padding"> <div class="comment-text"> <span class="comment-quotes custom-color">"</span> <p class="short-text"><span class="you-color">' + text.slice(0,9 + replay.length) + '</span> ' + text.slice(9 + replay.length) + '</span> <span class="more-text custom-color hidden-lg hidden-md hidden-sm">more...</span> </p> </div> <!--end comment-text--> </div> <!--end col-lg-7 col-lg-offset-0--> <hr/> </div> <!--end col-lg-12 col-lg-offset-0--> </div> <!--end container--> </div> <!--end comment-block-->'));
	        //$('asdf).copy().appendafter();
	        clickBtn.removeClass('click');
	      } else {
	        $('.last').removeClass('last').after($('<div class="comment-block last"><div class="container"><div class="col-lg-12 col-lg-offset-0 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 no-padding"><div class="col-lg-4 col-md-5 col-sm-6 col-xs-12 row"><div class="comment-person"><div class="col-lg-5 col-md-6 col-sm-5 col-xs-6 row"><div class="comment-avatar"><h2>' + nameImage[0] + '</h2></div><!--end comment-avatar--></div><!--end col-lg-5 col-md-6--><div class="col-lg-7 col-md-6 col-sm-7 col-xs-6 no-padding"><div class="comment-data"><p class="comment-person-name">' + name + '</p><p class="comment-time">' + datetime + '</p><a class="comment-reply-btn" href="#comments">Reply to ' + name + '</a></div><!--end comment-data--></div><!--end col-lg-7 col-md-6--></div><!--end comment-person--></div><!--end col-lg-4 col-md-5--><div class="col-lg-8 col-lg-offset-0 col-md-7 col-md-offset-0 col-sm-6 col-sm-offset-0 col-xs-8 col-xs-offset-4 no-padding"><div class="comment-text"><span class="comment-quotes custom-color">"</span><p class="short-text">' + text + '</span></span><span class="more-text custom-color hidden-lg hidden-md">more...</span></p></div><!--end comment-text--></div><!--end col-lg-8 col-lg-offset-0--><hr/></div><!--end col-lg-12 col-lg-offset-0 --></div></div><!--end -->'));
	      }

	      document.getElementById('comment-form').reset();

	    });
	  }

	  $('.more-text').on('click', function () {
	    $(this).parent().removeClass('short-text').addClass('full-text');
	  });
	  $('.less-text').on('click', function () {
	    $(this).parent().removeClass('full-text').addClass('short-text');
	  });
	  if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
	    // $('.ellipse-background').find('svg').attr('viewBox','-55 95 475 475');
	    // $('.square-background').find('svg').attr('viewBox','-32 52 272 272');
	    // $('.triangle-background').find('svg').attr('viewBox','-32 55 272 272');
	    // $('.comment-avatar').find('svg').attr('viewBox','-55 0 475 475');
	    // $('.single-blog-header').find('svg').attr('style','margin-top: 0;');
	    $('.ellipse-background').addClass('ie');
	    $('.square-background').addClass('ie');
	    $('.triangle-background').addClass('ie');
	    $('.comment-avatar').addClass('ie');
	    $('.single-blog-header').addClass('ie');
	  }

	  var colors = '#2196f3';
	  var map;
	  var marker;
	  function initialize() {
	    var myOptions = {
	      zoom: 13,
	      center: new google.maps.LatLng(40.822431, -73.942655),
	      scrollwheel: false,
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      styles: [{
	        "featureType": "all",
	        "elementType": "labels",
	        "stylers": [{ "font-family": "Roboto" }]
	      }, {
	        "featureType": "water",
	        "elementType": "geometry",
	        "stylers": [{ "color": colors }, { "lightness": 17 }]
	      }, {
	        "featureType": "landscape",
	        "elementType": "geometry",
	        "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }]
	      }, {
	        "featureType": "road.highway",
	        "elementType": "geometry.fill",
	        "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }]
	      }, {
	        "featureType": "road.highway",
	        "elementType": "geometry.stroke",
	        "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }]
	      }, {
	        "featureType": "road.arterial",
	        "elementType": "geometry",
	        "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }]
	      }, {
	        "featureType": "road.local",
	        "elementType": "geometry",
	        "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }]
	      }, {
	        "featureType": "poi",
	        "elementType": "geometry",
	        "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }]
	      }, {
	        "featureType": "poi.park",
	        "elementType": "geometry",
	        "stylers": [{ "color": "#dedede" }, { "lightness": 21 }]
	      }, {
	        "elementType": "labels.text.stroke",
	        "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }]
	      }, {
	        "elementType": "labels.text.fill",
	        "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }]
	      }, {
	        "elementType": "labels.icon",
	        "stylers": [{ "visibility": "off" }]
	      }, {
	        "featureType": "transit",
	        "elementType": "geometry",
	        "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }]
	      }, {
	        "featureType": "administrative",
	        "elementType": "geometry.fill",
	        "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }]
	      }, {
	        "featureType": "administrative",
	        "elementType": "geometry.stroke",
	        "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }]
	      }]
	    };
	    map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);
	    new google.maps.Marker({
	      map: map,
	      position: new google.maps.LatLng(40.822431, -73.942655)
	    });
	    google.maps.event.addListener(map, 'click', function(event) {
	      this.setOptions({ scrollwheel: true });
	    });
	  };
	  if ( false ) {
	    google.maps.event.addDomListener(window, 'load', initialize);
	  }
	  $('#colors-bullet').find('a').map(function(i, color) {
	    $(this).attr('style', 'background: #' + $(this)[0].id);
	    $(this).on('click', function() {
	      colors = '#' + $(this)[0].id;
	      var themeColor = $(this).data('color');
	      var body = $('body');
	      if ( body.hasClass('theme-black') ||
	        body.hasClass('theme-blue-grey') ||
	        body.hasClass('theme-grey') ||
	        body.hasClass('theme-brown') ||
	        body.hasClass('theme-deep-orange') ||
	        body.hasClass('theme-orange') ||
	        body.hasClass('theme-amber') ||
	        body.hasClass('theme-yellow') ||
	        body.hasClass('theme-lime') ||
	        body.hasClass('theme-light-green') ||
	        body.hasClass('theme-green') ||
	        body.hasClass('theme-teal') ||
	        body.hasClass('theme-cyan') ||
	        body.hasClass('theme-light-blue') ||
	        body.hasClass('theme-blue') ||
	        body.hasClass('theme-indigo') ||
	        body.hasClass('theme-deep-purple') ||
	        body.hasClass('theme-purple') ||
	        body.hasClass('theme-pink') ||
	        body.hasClass('theme-red') ) {
	        body.removeClass(function (index, css) {
	          return (css.match (/\btheme-\S+/g) || []).join(''); // removes anything that starts with "page-"
	        });
	      }
	      body.addClass('theme-' + themeColor);
	      console.log('theme-' + themeColor);
	      if ( false ) {
	        initialize();
	        google.maps.event.addDomListener(window, 'load', initialize);
	      }
	    });
	  });

	  $('#product-screen .point').on('click', function() {
	    var id = $(this).data('id');
	    if ( $('.product-info').hasClass('open') && '#' + $('.product-info.open').attr('id') !== id ) {
	      $('.product-info.open').removeClass('open');
	      $('#' + id).addClass('open');
	    } else if ( '#' + $('.product-info.open').attr('id') === id ) {
	      return false;
	    } else {
	      $('#' + id).addClass('open');
	    }
	  });


	  $('.product-info .close').on('click', function() {
	    $(this).closest('.product-info').removeClass('open');
	  });

	  $('.same-height').matchHeight();

	  // google.maps.event.addDomListener(window, 'load', initMap);

	})(jQuery);


/***/ },
/* 2 */
/***/ function(module, exports) {

	// Module Compatibility
	module.exports = function() {

	  // detecting browser
	  var doc = document.documentElement;
	  doc.setAttribute('data-useragent', navigator.userAgent);
	  doc.setAttribute('data-platform', navigator.platform);

	  var BrowserDetect = {
	    init: function () {
	      this.browser = this.searchString(this.dataBrowser) || "Other";
	      this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
	    },
	    searchString: function (data) {
	      for (var i = 0; i < data.length; i++) {
	        var dataString = data[i].string;
	        this.versionSearchString = data[i].subString;

	        if (dataString.indexOf(data[i].subString) !== -1) {
	          return data[i].identity;
	        }
	      }
	    },
	    searchVersion: function (dataString) {
	      var index = dataString.indexOf(this.versionSearchString);
	      if (index === -1) {
	        return;
	      }

	      var rv = dataString.indexOf("rv:");
	      if (this.versionSearchString === "Trident" && rv !== -1) {
	        return parseFloat(dataString.substring(rv + 3));
	      } else {
	        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
	      }
	    },

	    dataBrowser: [
	      {string: navigator.userAgent, subString: "Edge", identity: "MS Edge"},
	      {string: navigator.userAgent, subString: "MSIE", identity: "Explorer"},
	      {string: navigator.userAgent, subString: "Trident", identity: "Explorer"},
	      {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
	      {string: navigator.userAgent, subString: "Opera", identity: "Opera"},
	      {string: navigator.userAgent, subString: "OPR", identity: "Opera"},

	      {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"},
	      {string: navigator.userAgent, subString: "Safari", identity: "Safari"}
	    ]
	  };

	  BrowserDetect.init();

	  function placeholder() {
	    var placeholder = 'placeholder' in document.createElement('input');
	    if ( !placeholder ) {
	      $.getScript("assets/plugins/placeholder.js", function() {
	        $(":input").each(function() {
	          $(this).placeHolder();
	        });
	      });
	    }
	  }

	  // Browser Fixes
	  var safari10 = navigator.userAgent.indexOf("10.0 Safari") > -1;
	  var firefox = navigator.userAgent.indexOf("Firefox") > -1;
	  var IE9 = navigator.userAgent.indexOf("MSIE 9.0") > -1;
	  var IE10 = navigator.userAgent.indexOf("MSIE 10.0") > -1;

	  if ( safari10 ) {
	    $('body').addClass('safari-10');
	  } else if ( firefox ) {
	    $('body').addClass('firefox');
	  } else if ( IE9 ) {
	    $('body').addClass('ie9');
	    placeholder();
	  } else if ( IE10 ) {
	    $('body').addClass('ie10');
	  } else if ( BrowserDetect.browser == 'Explorer' && BrowserDetect.version == '11' ) {
	    $('body').addClass('ie11');
	  }
	};

/***/ }
/******/ ]);