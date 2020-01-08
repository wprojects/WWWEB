'use strict';

// Last time updated: 2019-04-08 6:55:46 AM UTC

// _________________________
// RTCMultiConnection v3.6.8

// Open-Sourced: https://github.com/muaz-khan/RTCMultiConnection

// --------------------------------------------------
// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
// --------------------------------------------------

"use strict";var RTCMultiConnection=function(roomid,forceOptions){function SocketConnection(connection,connectCallback){function isData(session){return!session.audio&&!session.video&&!session.screen&&session.data}function updateExtraBackup(remoteUserId,extra){connection.peersBackup[remoteUserId]||(connection.peersBackup[remoteUserId]={userid:remoteUserId,extra:{}}),connection.peersBackup[remoteUserId].extra=extra}function onMessageEvent(message){if(message.remoteUserId==connection.userid){if(connection.peers[message.sender]&&connection.peers[message.sender].extra!=message.message.extra&&(connection.peers[message.sender].extra=message.extra,connection.onExtraDataUpdated({userid:message.sender,extra:message.extra}),updateExtraBackup(message.sender,message.extra)),message.message.streamSyncNeeded&&connection.peers[message.sender]){var stream=connection.streamEvents[message.message.streamid];if(!stream||!stream.stream)return;var action=message.message.action;if("ended"===action||"inactive"===action||"stream-removed"===action)return connection.peersBackup[stream.userid]&&(stream.extra=connection.peersBackup[stream.userid].extra),void connection.onstreamended(stream);var type="both"!=message.message.type?message.message.type:null;return void("function"==typeof stream.stream[action]&&stream.stream[action](type))}if("dropPeerConnection"===message.message)return void connection.deletePeer(message.sender);if(message.message.allParticipants)return message.message.allParticipants.indexOf(message.sender)===-1&&message.message.allParticipants.push(message.sender),void message.message.allParticipants.forEach(function(participant){mPeer[connection.peers[participant]?"renegotiatePeer":"createNewPeer"](participant,{localPeerSdpConstraints:{OfferToReceiveAudio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.sdpConstraints.mandatory.OfferToReceiveVideo},remotePeerSdpConstraints:{OfferToReceiveAudio:connection.session.oneway?!!connection.session.audio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.session.oneway?!!connection.session.video||!!connection.session.screen:connection.sdpConstraints.mandatory.OfferToReceiveVideo},isOneWay:!!connection.session.oneway||"one-way"===connection.direction,isDataOnly:isData(connection.session)})});if(message.message.newParticipant){if(message.message.newParticipant==connection.userid)return;if(connection.peers[message.message.newParticipant])return;return void mPeer.createNewPeer(message.message.newParticipant,message.message.userPreferences||{localPeerSdpConstraints:{OfferToReceiveAudio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.sdpConstraints.mandatory.OfferToReceiveVideo},remotePeerSdpConstraints:{OfferToReceiveAudio:connection.session.oneway?!!connection.session.audio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.session.oneway?!!connection.session.video||!!connection.session.screen:connection.sdpConstraints.mandatory.OfferToReceiveVideo},isOneWay:!!connection.session.oneway||"one-way"===connection.direction,isDataOnly:isData(connection.session)})}if(message.message.readyForOffer&&(connection.attachStreams.length&&(connection.waitingForLocalMedia=!1),connection.waitingForLocalMedia))return void setTimeout(function(){onMessageEvent(message)},1);if(message.message.newParticipationRequest&&message.sender!==connection.userid){connection.peers[message.sender]&&connection.deletePeer(message.sender);var userPreferences={extra:message.extra||{},localPeerSdpConstraints:message.message.remotePeerSdpConstraints||{OfferToReceiveAudio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.sdpConstraints.mandatory.OfferToReceiveVideo},remotePeerSdpConstraints:message.message.localPeerSdpConstraints||{OfferToReceiveAudio:connection.session.oneway?!!connection.session.audio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.session.oneway?!!connection.session.video||!!connection.session.screen:connection.sdpConstraints.mandatory.OfferToReceiveVideo},isOneWay:"undefined"!=typeof message.message.isOneWay?message.message.isOneWay:!!connection.session.oneway||"one-way"===connection.direction,isDataOnly:"undefined"!=typeof message.message.isDataOnly?message.message.isDataOnly:isData(connection.session),dontGetRemoteStream:"undefined"!=typeof message.message.isOneWay?message.message.isOneWay:!!connection.session.oneway||"one-way"===connection.direction,dontAttachLocalStream:!!message.message.dontGetRemoteStream,connectionDescription:message,successCallback:function(){}};return void connection.onNewParticipant(message.sender,userPreferences)}return message.message.changedUUID&&connection.peers[message.message.oldUUID]&&(connection.peers[message.message.newUUID]=connection.peers[message.message.oldUUID],delete connection.peers[message.message.oldUUID]),message.message.userLeft?(mPeer.onUserLeft(message.sender),void(message.message.autoCloseEntireSession&&connection.leave())):void mPeer.addNegotiatedMessage(message.message,message.sender)}}var parameters="";parameters+="?userid="+connection.userid,parameters+="&sessionid="+connection.sessionid,parameters+="&msgEvent="+connection.socketMessageEvent,parameters+="&socketCustomEvent="+connection.socketCustomEvent,parameters+="&autoCloseEntireSession="+!!connection.autoCloseEntireSession,connection.session.broadcast===!0&&(parameters+="&oneToMany=true"),parameters+="&maxParticipantsAllowed="+connection.maxParticipantsAllowed,connection.enableScalableBroadcast&&(parameters+="&enableScalableBroadcast=true",parameters+="&maxRelayLimitPerUser="+(connection.maxRelayLimitPerUser||2)),parameters+="&extra="+JSON.stringify(connection.extra||{}),connection.socketCustomParameters&&(parameters+=connection.socketCustomParameters);try{io.sockets={}}catch(e){}if(connection.socketURL||(connection.socketURL="/"),"/"!=connection.socketURL.substr(connection.socketURL.length-1,1))throw'"socketURL" MUST end with a slash.';connection.enableLogs&&("/"==connection.socketURL?console.info("socket.io url is: ",location.origin+"/"):console.info("socket.io url is: ",connection.socketURL));try{connection.socket=io(connection.socketURL+parameters)}catch(e){connection.socket=io.connect(connection.socketURL+parameters,connection.socketOptions)}var mPeer=connection.multiPeersHandler;connection.socket.on("extra-data-updated",function(remoteUserId,extra){connection.peers[remoteUserId]&&(connection.peers[remoteUserId].extra=extra,connection.onExtraDataUpdated({userid:remoteUserId,extra:extra}),updateExtraBackup(remoteUserId,extra))}),connection.socket.on(connection.socketMessageEvent,onMessageEvent);var alreadyConnected=!1;connection.socket.resetProps=function(){alreadyConnected=!1},connection.socket.on("connect",function(){alreadyConnected||(alreadyConnected=!0,connection.enableLogs&&console.info("socket.io connection is opened."),setTimeout(function(){connection.socket.emit("extra-data-updated",connection.extra)},1e3),connectCallback&&connectCallback(connection.socket))}),connection.socket.on("disconnect",function(event){connection.onSocketDisconnect(event)}),connection.socket.on("error",function(event){connection.onSocketError(event)}),connection.socket.on("user-disconnected",function(remoteUserId){remoteUserId!==connection.userid&&(connection.onUserStatusChanged({userid:remoteUserId,status:"offline",extra:connection.peers[remoteUserId]?connection.peers[remoteUserId].extra||{}:{}}),connection.deletePeer(remoteUserId))}),connection.socket.on("user-connected",function(userid){userid!==connection.userid&&connection.onUserStatusChanged({userid:userid,status:"online",extra:connection.peers[userid]?connection.peers[userid].extra||{}:{}})}),connection.socket.on("closed-entire-session",function(sessionid,extra){connection.leave(),connection.onEntireSessionClosed({sessionid:sessionid,userid:sessionid,extra:extra})}),connection.socket.on("userid-already-taken",function(useridAlreadyTaken,yourNewUserId){connection.onUserIdAlreadyTaken(useridAlreadyTaken,yourNewUserId)}),connection.socket.on("logs",function(log){connection.enableLogs&&console.debug("server-logs",log)}),connection.socket.on("number-of-broadcast-viewers-updated",function(data){connection.onNumberOfBroadcastViewersUpdated(data)}),connection.socket.on("set-isInitiator-true",function(sessionid){sessionid==connection.sessionid&&(connection.isInitiator=!0)})}function MultiPeers(connection){function initFileBufferReader(){connection.fbr=new FileBufferReader,connection.fbr.onProgress=function(chunk){connection.onFileProgress(chunk)},connection.fbr.onBegin=function(file){connection.onFileStart(file)},connection.fbr.onEnd=function(file){connection.onFileEnd(file)}}var self=this,skipPeers=["getAllParticipants","getLength","selectFirst","streams","send","forEach"];connection.peers={getLength:function(){var numberOfPeers=0;for(var peer in this)skipPeers.indexOf(peer)==-1&&numberOfPeers++;return numberOfPeers},selectFirst:function(){var firstPeer;for(var peer in this)skipPeers.indexOf(peer)==-1&&(firstPeer=this[peer]);return firstPeer},getAllParticipants:function(sender){var allPeers=[];for(var peer in this)skipPeers.indexOf(peer)==-1&&peer!=sender&&allPeers.push(peer);return allPeers},forEach:function(callbcak){this.getAllParticipants().forEach(function(participant){callbcak(connection.peers[participant])})},send:function(data,remoteUserId){var that=this;if(!isNull(data.size)&&!isNull(data.type)){if(connection.enableFileSharing)return void self.shareFile(data,remoteUserId);"string"!=typeof data&&(data=JSON.stringify(data))}if(!("text"===data.type||data instanceof ArrayBuffer||data instanceof DataView))return void TextSender.send({text:data,channel:this,connection:connection,remoteUserId:remoteUserId});if("text"===data.type&&(data=JSON.stringify(data)),remoteUserId){var remoteUser=connection.peers[remoteUserId];if(remoteUser)return remoteUser.channels.length?void remoteUser.channels.forEach(function(channel){channel.send(data)}):(connection.peers[remoteUserId].createDataChannel(),connection.renegotiate(remoteUserId),void setTimeout(function(){that.send(data,remoteUserId)},3e3))}this.getAllParticipants().forEach(function(participant){return that[participant].channels.length?void that[participant].channels.forEach(function(channel){channel.send(data)}):(connection.peers[participant].createDataChannel(),connection.renegotiate(participant),void setTimeout(function(){that[participant].channels.forEach(function(channel){channel.send(data)})},3e3))})}},this.uuid=connection.userid,this.getLocalConfig=function(remoteSdp,remoteUserId,userPreferences){return userPreferences||(userPreferences={}),{streamsToShare:userPreferences.streamsToShare||{},rtcMultiConnection:connection,connectionDescription:userPreferences.connectionDescription,userid:remoteUserId,localPeerSdpConstraints:userPreferences.localPeerSdpConstraints,remotePeerSdpConstraints:userPreferences.remotePeerSdpConstraints,dontGetRemoteStream:!!userPreferences.dontGetRemoteStream,dontAttachLocalStream:!!userPreferences.dontAttachLocalStream,renegotiatingPeer:!!userPreferences.renegotiatingPeer,peerRef:userPreferences.peerRef,channels:userPreferences.channels||[],onLocalSdp:function(localSdp){self.onNegotiationNeeded(localSdp,remoteUserId)},onLocalCandidate:function(localCandidate){localCandidate=OnIceCandidateHandler.processCandidates(connection,localCandidate),localCandidate&&self.onNegotiationNeeded(localCandidate,remoteUserId)},remoteSdp:remoteSdp,onDataChannelMessage:function(message){if(!connection.fbr&&connection.enableFileSharing&&initFileBufferReader(),"string"==typeof message||!connection.enableFileSharing)return void self.onDataChannelMessage(message,remoteUserId);var that=this;return message instanceof ArrayBuffer||message instanceof DataView?void connection.fbr.convertToObject(message,function(object){that.onDataChannelMessage(object)}):message.readyForNextChunk?void connection.fbr.getNextChunk(message,function(nextChunk,isLastChunk){connection.peers[remoteUserId].channels.forEach(function(channel){channel.send(nextChunk)})},remoteUserId):message.chunkMissing?void connection.fbr.chunkMissing(message):void connection.fbr.addChunk(message,function(promptNextChunk){connection.peers[remoteUserId].peer.channel.send(promptNextChunk)})},onDataChannelError:function(error){self.onDataChannelError(error,remoteUserId)},onDataChannelOpened:function(channel){self.onDataChannelOpened(channel,remoteUserId)},onDataChannelClosed:function(event){self.onDataChannelClosed(event,remoteUserId)},onRemoteStream:function(stream){connection.peers[remoteUserId]&&connection.peers[remoteUserId].streams.push(stream),self.onGettingRemoteMedia(stream,remoteUserId)},onRemoteStreamRemoved:function(stream){self.onRemovingRemoteMedia(stream,remoteUserId)},onPeerStateChanged:function(states){self.onPeerStateChanged(states),"new"===states.iceConnectionState&&self.onNegotiationStarted(remoteUserId,states),"connected"===states.iceConnectionState&&self.onNegotiationCompleted(remoteUserId,states),states.iceConnectionState.search(/closed|failed/gi)!==-1&&(self.onUserLeft(remoteUserId),self.disconnectWith(remoteUserId))}}},this.createNewPeer=function(remoteUserId,userPreferences){if(!(connection.maxParticipantsAllowed<=connection.getAllParticipants().length)){if(userPreferences=userPreferences||{},connection.isInitiator&&connection.session.audio&&"two-way"===connection.session.audio&&!userPreferences.streamsToShare&&(userPreferences.isOneWay=!1,userPreferences.isDataOnly=!1,userPreferences.session=connection.session),!userPreferences.isOneWay&&!userPreferences.isDataOnly)return userPreferences.isOneWay=!0,void this.onNegotiationNeeded({enableMedia:!0,userPreferences:userPreferences},remoteUserId);userPreferences=connection.setUserPreferences(userPreferences,remoteUserId);var localConfig=this.getLocalConfig(null,remoteUserId,userPreferences);connection.peers[remoteUserId]=new PeerInitiator(localConfig)}},this.createAnsweringPeer=function(remoteSdp,remoteUserId,userPreferences){userPreferences=connection.setUserPreferences(userPreferences||{},remoteUserId);var localConfig=this.getLocalConfig(remoteSdp,remoteUserId,userPreferences);connection.peers[remoteUserId]=new PeerInitiator(localConfig)},this.renegotiatePeer=function(remoteUserId,userPreferences,remoteSdp){if(!connection.peers[remoteUserId])return void(connection.enableLogs&&console.error("Peer ("+remoteUserId+") does not exist. Renegotiation skipped."));userPreferences||(userPreferences={}),userPreferences.renegotiatingPeer=!0,userPreferences.peerRef=connection.peers[remoteUserId].peer,userPreferences.channels=connection.peers[remoteUserId].channels;var localConfig=this.getLocalConfig(remoteSdp,remoteUserId,userPreferences);connection.peers[remoteUserId]=new PeerInitiator(localConfig)},this.replaceTrack=function(track,remoteUserId,isVideoTrack){if(!connection.peers[remoteUserId])throw"This peer ("+remoteUserId+") does not exist.";var peer=connection.peers[remoteUserId].peer;return peer.getSenders&&"function"==typeof peer.getSenders&&peer.getSenders().length?void peer.getSenders().forEach(function(rtpSender){isVideoTrack&&"video"===rtpSender.track.kind&&(connection.peers[remoteUserId].peer.lastVideoTrack=rtpSender.track,rtpSender.replaceTrack(track)),isVideoTrack||"audio"!==rtpSender.track.kind||(connection.peers[remoteUserId].peer.lastAudioTrack=rtpSender.track,rtpSender.replaceTrack(track))}):(console.warn("RTPSender.replaceTrack is NOT supported."),void this.renegotiatePeer(remoteUserId))},this.onNegotiationNeeded=function(message,remoteUserId){},this.addNegotiatedMessage=function(message,remoteUserId){if(message.type&&message.sdp)return"answer"==message.type&&connection.peers[remoteUserId]&&connection.peers[remoteUserId].addRemoteSdp(message),"offer"==message.type&&(message.renegotiatingPeer?this.renegotiatePeer(remoteUserId,null,message):this.createAnsweringPeer(message,remoteUserId)),void(connection.enableLogs&&console.log("Remote peer's sdp:",message.sdp));if(message.candidate)return connection.peers[remoteUserId]&&connection.peers[remoteUserId].addRemoteCandidate(message),void(connection.enableLogs&&console.log("Remote peer's candidate pairs:",message.candidate));if(message.enableMedia){connection.session=message.userPreferences.session||connection.session,connection.session.oneway&&connection.attachStreams.length&&(connection.attachStreams=[]),message.userPreferences.isDataOnly&&connection.attachStreams.length&&(connection.attachStreams.length=[]);var streamsToShare={};connection.attachStreams.forEach(function(stream){streamsToShare[stream.streamid]={isAudio:!!stream.isAudio,isVideo:!!stream.isVideo,isScreen:!!stream.isScreen}}),message.userPreferences.streamsToShare=streamsToShare,self.onNegotiationNeeded({readyForOffer:!0,userPreferences:message.userPreferences},remoteUserId)}message.readyForOffer&&connection.onReadyForOffer(remoteUserId,message.userPreferences)},this.onGettingRemoteMedia=function(stream,remoteUserId){},this.onRemovingRemoteMedia=function(stream,remoteUserId){},this.onGettingLocalMedia=function(localStream){},this.onLocalMediaError=function(error,constraints){connection.onMediaError(error,constraints)},this.shareFile=function(file,remoteUserId){initFileBufferReader(),connection.fbr.readAsArrayBuffer(file,function(uuid){var arrayOfUsers=connection.getAllParticipants();remoteUserId&&(arrayOfUsers=[remoteUserId]),arrayOfUsers.forEach(function(participant){connection.fbr.getNextChunk(uuid,function(nextChunk){connection.peers[participant].channels.forEach(function(channel){channel.send(nextChunk)})},participant)})},{userid:connection.userid,chunkSize:"Firefox"===DetectRTC.browser.name?15e3:connection.chunkSize||0})};var textReceiver=new TextReceiver(connection);this.onDataChannelMessage=function(message,remoteUserId){textReceiver.receive(JSON.parse(message),remoteUserId,connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:{})},this.onDataChannelClosed=function(event,remoteUserId){event.userid=remoteUserId,event.extra=connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:{},connection.onclose(event)},this.onDataChannelError=function(error,remoteUserId){error.userid=remoteUserId,event.extra=connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:{},connection.onerror(error)},this.onDataChannelOpened=function(channel,remoteUserId){return connection.peers[remoteUserId].channels.length?void(connection.peers[remoteUserId].channels=[channel]):(connection.peers[remoteUserId].channels.push(channel),void connection.onopen({userid:remoteUserId,extra:connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:{},channel:channel}))},this.onPeerStateChanged=function(state){connection.onPeerStateChanged(state)},this.onNegotiationStarted=function(remoteUserId,states){},this.onNegotiationCompleted=function(remoteUserId,states){},this.getRemoteStreams=function(remoteUserId){return remoteUserId=remoteUserId||connection.peers.getAllParticipants()[0],connection.peers[remoteUserId]?connection.peers[remoteUserId].streams:[]}}function fireEvent(obj,eventName,args){if("undefined"!=typeof CustomEvent){var eventDetail={arguments:args,__exposedProps__:args},event=new CustomEvent(eventName,eventDetail);obj.dispatchEvent(event)}}function setHarkEvents(connection,streamEvent){if(streamEvent.stream&&getTracks(streamEvent.stream,"audio").length){if(!connection||!streamEvent)throw"Both arguments are required.";if(connection.onspeaking&&connection.onsilence){if("undefined"==typeof hark)throw"hark.js not found.";hark(streamEvent.stream,{onspeaking:function(){connection.onspeaking(streamEvent)},onsilence:function(){connection.onsilence(streamEvent)},onvolumechange:function(volume,threshold){connection.onvolumechange&&connection.onvolumechange(merge({volume:volume,threshold:threshold},streamEvent))}})}}}function setMuteHandlers(connection,streamEvent){streamEvent.stream&&streamEvent.stream&&streamEvent.stream.addEventListener&&(streamEvent.stream.addEventListener("mute",function(event){event=connection.streamEvents[streamEvent.streamid],event.session={audio:"audio"===event.muteType,video:"video"===event.muteType},connection.onmute(event)},!1),streamEvent.stream.addEventListener("unmute",function(event){event=connection.streamEvents[streamEvent.streamid],event.session={audio:"audio"===event.unmuteType,video:"video"===event.unmuteType},connection.onunmute(event)},!1))}function getRandomString(){if(window.crypto&&window.crypto.getRandomValues&&navigator.userAgent.indexOf("Safari")===-1){for(var a=window.crypto.getRandomValues(new Uint32Array(3)),token="",i=0,l=a.length;i<l;i++)token+=a[i].toString(36);return token}return(Math.random()*(new Date).getTime()).toString(36).replace(/\./g,"")}function getRMCMediaElement(stream,callback,connection){if(!connection.autoCreateMediaElement)return void callback({});var isAudioOnly=!1;getTracks(stream,"video").length||stream.isVideo||stream.isScreen||(isAudioOnly=!0),"Firefox"===DetectRTC.browser.name&&(connection.session.video||connection.session.screen)&&(isAudioOnly=!1);var mediaElement=document.createElement(isAudioOnly?"audio":"video");if(mediaElement.srcObject=stream,mediaElement.setAttribute("autoplay",!0),mediaElement.setAttribute("playsinline",!0),mediaElement.setAttribute("controls",!0),mediaElement.setAttribute("muted",!1),mediaElement.setAttribute("volume",1),"Firefox"===DetectRTC.browser.name){var streamEndedEvent="ended";"oninactive"in mediaElement&&(streamEndedEvent="inactive"),mediaElement.addEventListener(streamEndedEvent,function(){if(currentUserMediaRequest.remove(stream.idInstance),"local"===stream.type){streamEndedEvent="ended","oninactive"in stream&&(streamEndedEvent="inactive"),StreamsHandler.onSyncNeeded(stream.streamid,streamEndedEvent),connection.attachStreams.forEach(function(aStream,idx){stream.streamid===aStream.streamid&&delete connection.attachStreams[idx]});var newStreamsArray=[];connection.attachStreams.forEach(function(aStream){aStream&&newStreamsArray.push(aStream)}),connection.attachStreams=newStreamsArray;var streamEvent=connection.streamEvents[stream.streamid];if(streamEvent)return void connection.onstreamended(streamEvent);this.parentNode&&this.parentNode.removeChild(this)}},!1)}var played=mediaElement.play();if("undefined"!=typeof played){var cbFired=!1;setTimeout(function(){cbFired||(cbFired=!0,callback(mediaElement))},1e3),played.then(function(){cbFired||(cbFired=!0,callback(mediaElement))})["catch"](function(error){cbFired||(cbFired=!0,callback(mediaElement))})}else callback(mediaElement)}function listenEventHandler(eventName,eventHandler){window.removeEventListener(eventName,eventHandler),window.addEventListener(eventName,eventHandler,!1)}function removeNullEntries(array){var newArray=[];return array.forEach(function(item){item&&newArray.push(item)}),newArray}function isData(session){return!session.audio&&!session.video&&!session.screen&&session.data}function isNull(obj){return"undefined"==typeof obj}function isString(obj){return"string"==typeof obj}function isAudioPlusTab(connection,audioPlusTab){return(!connection.session.audio||"two-way"!==connection.session.audio)&&("Firefox"===DetectRTC.browser.name&&audioPlusTab!==!1||!("Chrome"!==DetectRTC.browser.name||DetectRTC.browser.version<50)&&(typeof audioPlusTab===!0||!("undefined"!=typeof audioPlusTab||!connection.session.audio||!connection.session.screen||connection.session.video)&&(audioPlusTab=!0,!0)))}function getAudioScreenConstraints(screen_constraints){return"Firefox"===DetectRTC.browser.name||"Chrome"===DetectRTC.browser.name&&{mandatory:{chromeMediaSource:screen_constraints.mandatory.chromeMediaSource,chromeMediaSourceId:screen_constraints.mandatory.chromeMediaSourceId}}}function getTracks(stream,kind){return stream&&stream.getTracks?stream.getTracks().filter(function(t){return t.kind===(kind||"audio")}):[]}function isUnifiedPlanSupportedDefault(){var canAddTransceiver=!1;try{if("undefined"==typeof RTCRtpTransceiver)return!1;if(!("currentDirection"in RTCRtpTransceiver.prototype))return!1;var tempPc=new RTCPeerConnection;try{tempPc.addTransceiver("audio"),canAddTransceiver=!0}catch(e){}tempPc.close()}catch(e){canAddTransceiver=!1}return canAddTransceiver&&isUnifiedPlanSuppored()}function isUnifiedPlanSuppored(){var isUnifiedPlanSupported=!1;try{var pc=new RTCPeerConnection({sdpSemantics:"unified-plan"});try{var config=pc.getConfiguration();isUnifiedPlanSupported="unified-plan"==config.sdpSemantics||("plan-b"==config.sdpSemantics,!1)}catch(e){isUnifiedPlanSupported=!1}}catch(e){isUnifiedPlanSupported=!1}return isUnifiedPlanSupported}function setCordovaAPIs(){if("undefined"!=typeof cordova&&"undefined"!=typeof cordova.plugins&&"undefined"!=typeof cordova.plugins.iosrtc){var iosrtc=cordova.plugins.iosrtc;window.webkitRTCPeerConnection=iosrtc.RTCPeerConnection,window.RTCSessionDescription=iosrtc.RTCSessionDescription,window.RTCIceCandidate=iosrtc.RTCIceCandidate,window.MediaStream=iosrtc.MediaStream,window.MediaStreamTrack=iosrtc.MediaStreamTrack,navigator.getUserMedia=navigator.webkitGetUserMedia=iosrtc.getUserMedia,iosrtc.debug.enable("iosrtc*"),"function"==typeof iosrtc.selectAudioOutput&&iosrtc.selectAudioOutput(window.iOSDefaultAudioOutputDevice||"speaker"),iosrtc.registerGlobals()}}function setSdpConstraints(config){var sdpConstraints={OfferToReceiveAudio:!!config.OfferToReceiveAudio,OfferToReceiveVideo:!!config.OfferToReceiveVideo};return sdpConstraints}function PeerInitiator(config){function setChannelEvents(channel){channel.binaryType="arraybuffer",channel.onmessage=function(event){config.onDataChannelMessage(event.data)},channel.onopen=function(){config.onDataChannelOpened(channel)},channel.onerror=function(error){config.onDataChannelError(error)},channel.onclose=function(event){config.onDataChannelClosed(event)},channel.internalSend=channel.send,channel.send=function(data){"open"===channel.readyState&&channel.internalSend(data)},peer.channel=channel}function createOfferOrAnswer(_method){peer[_method](defaults.sdpConstraints).then(function(localSdp){"Safari"!==DetectRTC.browser.name&&(localSdp.sdp=connection.processSdp(localSdp.sdp)),peer.setLocalDescription(localSdp).then(function(){connection.trickleIce&&(config.onLocalSdp({type:localSdp.type,sdp:localSdp.sdp,remotePeerSdpConstraints:config.remotePeerSdpConstraints||!1,renegotiatingPeer:!!config.renegotiatingPeer||!1,connectionDescription:self.connectionDescription,dontGetRemoteStream:!!config.dontGetRemoteStream,extra:connection?connection.extra:{},streamsToShare:streamsToShare}),connection.onSettingLocalDescription(self))},function(error){connection.enableLogs&&console.error("setLocalDescription error",error)})},function(error){connection.enableLogs&&console.error("sdp-error",error)})}if("undefined"!=typeof window.RTCPeerConnection?RTCPeerConnection=window.RTCPeerConnection:"undefined"!=typeof mozRTCPeerConnection?RTCPeerConnection=mozRTCPeerConnection:"undefined"!=typeof webkitRTCPeerConnection&&(RTCPeerConnection=webkitRTCPeerConnection),RTCSessionDescription=window.RTCSessionDescription||window.mozRTCSessionDescription,RTCIceCandidate=window.RTCIceCandidate||window.mozRTCIceCandidate,MediaStreamTrack=window.MediaStreamTrack,!RTCPeerConnection)throw"WebRTC 1.0 (RTCPeerConnection) API are NOT available in this browser.";var connection=config.rtcMultiConnection;this.extra=config.remoteSdp?config.remoteSdp.extra:connection.extra,this.userid=config.userid,this.streams=[],this.channels=config.channels||[],this.connectionDescription=config.connectionDescription,this.addStream=function(session){connection.addStream(session,self.userid)},this.removeStream=function(streamid){connection.removeStream(streamid,self.userid)};var self=this;config.remoteSdp&&(this.connectionDescription=config.remoteSdp.connectionDescription);var allRemoteStreams={};defaults.sdpConstraints=setSdpConstraints({OfferToReceiveAudio:!0,OfferToReceiveVideo:!0});var peer,renegotiatingPeer=!!config.renegotiatingPeer;config.remoteSdp&&(renegotiatingPeer=!!config.remoteSdp.renegotiatingPeer);var localStreams=[];if(connection.attachStreams.forEach(function(stream){stream&&localStreams.push(stream)}),renegotiatingPeer)peer=config.peerRef;else{var iceTransports="all";(connection.candidates.turn||connection.candidates.relay)&&(connection.candidates.stun||connection.candidates.reflexive||connection.candidates.host||(iceTransports="relay"));try{var params={iceServers:connection.iceServers,iceTransportPolicy:connection.iceTransportPolicy||iceTransports};"undefined"!=typeof connection.iceCandidatePoolSize&&(params.iceCandidatePoolSize=connection.iceCandidatePoolSize),"undefined"!=typeof connection.bundlePolicy&&(params.bundlePolicy=connection.bundlePolicy),"undefined"!=typeof connection.rtcpMuxPolicy&&(params.rtcpMuxPolicy=connection.rtcpMuxPolicy),connection.sdpSemantics&&(params.sdpSemantics=connection.sdpSemantics||"unified-plan"),connection.iceServers&&connection.iceServers.length||(params=null,connection.optionalArgument=null),peer=new RTCPeerConnection(params,connection.optionalArgument)}catch(e){try{var params={iceServers:connection.iceServers};peer=new RTCPeerConnection(params)}catch(e){peer=new RTCPeerConnection}}}!peer.getRemoteStreams&&peer.getReceivers&&(peer.getRemoteStreams=function(){var stream=new MediaStream;return peer.getReceivers().forEach(function(receiver){stream.addTrack(receiver.track)}),[stream]}),!peer.getLocalStreams&&peer.getSenders&&(peer.getLocalStreams=function(){var stream=new MediaStream;return peer.getSenders().forEach(function(sender){stream.addTrack(sender.track)}),[stream]}),peer.onicecandidate=function(event){if(event.candidate)connection.trickleIce&&config.onLocalCandidate({candidate:event.candidate.candidate,sdpMid:event.candidate.sdpMid,sdpMLineIndex:event.candidate.sdpMLineIndex});else if(!connection.trickleIce){var localSdp=peer.localDescription;config.onLocalSdp({type:localSdp.type,sdp:localSdp.sdp,remotePeerSdpConstraints:config.remotePeerSdpConstraints||!1,renegotiatingPeer:!!config.renegotiatingPeer||!1,connectionDescription:self.connectionDescription,dontGetRemoteStream:!!config.dontGetRemoteStream,extra:connection?connection.extra:{},streamsToShare:streamsToShare})}},localStreams.forEach(function(localStream){config.remoteSdp&&config.remoteSdp.remotePeerSdpConstraints&&config.remoteSdp.remotePeerSdpConstraints.dontGetRemoteStream||config.dontAttachLocalStream||(localStream=connection.beforeAddingStream(localStream,self),localStream&&(peer.getLocalStreams().forEach(function(stream){localStream&&stream.id==localStream.id&&(localStream=null)}),localStream&&localStream.getTracks&&localStream.getTracks().forEach(function(track){try{peer.addTrack(track,localStream)}catch(e){}})))}),peer.oniceconnectionstatechange=peer.onsignalingstatechange=function(){var extra=self.extra;connection.peers[self.userid]&&(extra=connection.peers[self.userid].extra||extra),peer&&(config.onPeerStateChanged({iceConnectionState:peer.iceConnectionState,iceGatheringState:peer.iceGatheringState,signalingState:peer.signalingState,extra:extra,userid:self.userid}),peer&&peer.iceConnectionState&&peer.iceConnectionState.search(/closed|failed/gi)!==-1&&self.streams instanceof Array&&self.streams.forEach(function(stream){var streamEvent=connection.streamEvents[stream.id]||{streamid:stream.id,stream:stream,type:"remote"};connection.onstreamended(streamEvent)}))};var sdpConstraints={OfferToReceiveAudio:!!localStreams.length,OfferToReceiveVideo:!!localStreams.length};config.localPeerSdpConstraints&&(sdpConstraints=config.localPeerSdpConstraints),defaults.sdpConstraints=setSdpConstraints(sdpConstraints);var dontDuplicate={};peer.ontrack=function(event){if(event&&"track"===event.type){if(event.stream=event.streams[event.streams.length-1],event.stream.id||(event.stream.id=event.track.id),dontDuplicate[event.stream.id]&&"Safari"!==DetectRTC.browser.name)return void(event.track&&(event.track.onended=function(){
peer&&peer.onremovestream(event)}));dontDuplicate[event.stream.id]=event.stream.id;var streamsToShare={};config.remoteSdp&&config.remoteSdp.streamsToShare?streamsToShare=config.remoteSdp.streamsToShare:config.streamsToShare&&(streamsToShare=config.streamsToShare);var streamToShare=streamsToShare[event.stream.id];streamToShare?(event.stream.isAudio=streamToShare.isAudio,event.stream.isVideo=streamToShare.isVideo,event.stream.isScreen=streamToShare.isScreen):(event.stream.isVideo=!!getTracks(event.stream,"video").length,event.stream.isAudio=!event.stream.isVideo,event.stream.isScreen=!1),event.stream.streamid=event.stream.id,allRemoteStreams[event.stream.id]=event.stream,config.onRemoteStream(event.stream),event.stream.getTracks().forEach(function(track){track.onended=function(){peer&&peer.onremovestream(event)}}),event.stream.onremovetrack=function(){peer&&peer.onremovestream(event)}}},peer.onremovestream=function(event){event.stream.streamid=event.stream.id,allRemoteStreams[event.stream.id]&&delete allRemoteStreams[event.stream.id],config.onRemoteStreamRemoved(event.stream)},"function"!=typeof peer.removeStream&&(peer.removeStream=function(stream){stream.getTracks().forEach(function(track){peer.removeTrack(track,stream)})}),this.addRemoteCandidate=function(remoteCandidate){peer.addIceCandidate(new RTCIceCandidate(remoteCandidate))},this.addRemoteSdp=function(remoteSdp,cb){cb=cb||function(){},"Safari"!==DetectRTC.browser.name&&(remoteSdp.sdp=connection.processSdp(remoteSdp.sdp)),peer.setRemoteDescription(new RTCSessionDescription(remoteSdp)).then(cb,function(error){connection.enableLogs&&console.error("setRemoteDescription failed","\n",error,"\n",remoteSdp.sdp),cb()})["catch"](function(error){connection.enableLogs&&console.error("setRemoteDescription failed","\n",error,"\n",remoteSdp.sdp),cb()})};var isOfferer=!0;config.remoteSdp&&(isOfferer=!1),this.createDataChannel=function(){var channel=peer.createDataChannel("sctp",{});setChannelEvents(channel)},connection.session.data!==!0||renegotiatingPeer||(isOfferer?this.createDataChannel():peer.ondatachannel=function(event){var channel=event.channel;setChannelEvents(channel)}),this.enableDisableVideoEncoding=function(enable){var rtcp;if(peer.getSenders().forEach(function(sender){rtcp||"video"!==sender.track.kind||(rtcp=sender)}),rtcp&&rtcp.getParameters){var parameters=rtcp.getParameters();parameters.encodings[1]&&(parameters.encodings[1].active=!!enable),parameters.encodings[2]&&(parameters.encodings[2].active=!!enable),rtcp.setParameters(parameters)}},config.remoteSdp&&(config.remoteSdp.remotePeerSdpConstraints&&(sdpConstraints=config.remoteSdp.remotePeerSdpConstraints),defaults.sdpConstraints=setSdpConstraints(sdpConstraints),this.addRemoteSdp(config.remoteSdp,function(){createOfferOrAnswer("createAnswer")})),"two-way"!=connection.session.audio&&"two-way"!=connection.session.video&&"two-way"!=connection.session.screen||(defaults.sdpConstraints=setSdpConstraints({OfferToReceiveAudio:"two-way"==connection.session.audio||config.remoteSdp&&config.remoteSdp.remotePeerSdpConstraints&&config.remoteSdp.remotePeerSdpConstraints.OfferToReceiveAudio,OfferToReceiveVideo:"two-way"==connection.session.video||"two-way"==connection.session.screen||config.remoteSdp&&config.remoteSdp.remotePeerSdpConstraints&&config.remoteSdp.remotePeerSdpConstraints.OfferToReceiveAudio}));var streamsToShare={};peer.getLocalStreams().forEach(function(stream){streamsToShare[stream.streamid]={isAudio:!!stream.isAudio,isVideo:!!stream.isVideo,isScreen:!!stream.isScreen}}),isOfferer&&createOfferOrAnswer("createOffer"),peer.nativeClose=peer.close,peer.close=function(){if(peer){try{peer.nativeClose!==peer.close&&peer.nativeClose()}catch(e){}peer=null,self.peer=null}},this.peer=peer}function setStreamType(constraints,stream){constraints.mandatory&&constraints.mandatory.chromeMediaSource?stream.isScreen=!0:constraints.mozMediaSource||constraints.mediaSource?stream.isScreen=!0:constraints.video?stream.isVideo=!0:constraints.audio&&(stream.isAudio=!0)}function getUserMediaHandler(options){function streaming(stream,returnBack){setStreamType(options.localMediaConstraints,stream);var streamEndedEvent="ended";"oninactive"in stream&&(streamEndedEvent="inactive"),stream.addEventListener(streamEndedEvent,function(){delete currentUserMediaRequest.streams[idInstance],currentUserMediaRequest.mutex=!1,currentUserMediaRequest.queueRequests.indexOf(options)&&(delete currentUserMediaRequest.queueRequests[currentUserMediaRequest.queueRequests.indexOf(options)],currentUserMediaRequest.queueRequests=removeNullEntries(currentUserMediaRequest.queueRequests))},!1),currentUserMediaRequest.streams[idInstance]={stream:stream},currentUserMediaRequest.mutex=!1,currentUserMediaRequest.queueRequests.length&&getUserMediaHandler(currentUserMediaRequest.queueRequests.shift()),options.onGettingLocalMedia(stream,returnBack)}if(currentUserMediaRequest.mutex===!0)return void currentUserMediaRequest.queueRequests.push(options);currentUserMediaRequest.mutex=!0;var idInstance=JSON.stringify(options.localMediaConstraints);if(currentUserMediaRequest.streams[idInstance])streaming(currentUserMediaRequest.streams[idInstance].stream,!0);else{var isBlackBerry=!!/BB10|BlackBerry/i.test(navigator.userAgent||"");if(isBlackBerry||"undefined"==typeof navigator.mediaDevices||"function"!=typeof navigator.mediaDevices.getUserMedia)return navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia,void navigator.getUserMedia(options.localMediaConstraints,function(stream){stream.streamid=stream.streamid||stream.id||getRandomString(),stream.idInstance=idInstance,streaming(stream)},function(error){options.onLocalMediaError(error,options.localMediaConstraints)});if("undefined"==typeof navigator.mediaDevices){navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia;var getUserMediaStream,getUserMediaError,getUserMediaSuccess=function(){},getUserMediaFailure=function(){};navigator.mediaDevices={getUserMedia:function(hints){return navigator.getUserMedia(hints,function(getUserMediaSuccess){getUserMediaSuccess(stream),getUserMediaStream=stream},function(error){getUserMediaFailure(error),getUserMediaError=error}),{then:function(successCB){return getUserMediaStream?void successCB(getUserMediaStream):(getUserMediaSuccess=successCB,{then:function(failureCB){return getUserMediaError?void failureCB(getUserMediaError):void(getUserMediaFailure=failureCB)}})}}}}}navigator.mediaDevices.getUserMedia(options.localMediaConstraints).then(function(stream){stream.streamid=stream.streamid||stream.id||getRandomString(),stream.idInstance=idInstance,streaming(stream)})["catch"](function(error){options.onLocalMediaError(error,options.localMediaConstraints)})}}function onMessageCallback(data){if("PermissionDeniedError"==data){if(chromeMediaSource="PermissionDeniedError",screenCallback)return screenCallback("PermissionDeniedError");throw new Error("PermissionDeniedError")}"rtcmulticonnection-extension-loaded"==data&&(chromeMediaSource="desktop"),data.sourceId&&screenCallback&&screenCallback(sourceId=data.sourceId,data.canRequestAudioTrack===!0)}function isChromeExtensionAvailable(callback){if(callback){if("desktop"==chromeMediaSource)return callback(!0);window.postMessage("are-you-there","*"),setTimeout(function(){callback("screen"==chromeMediaSource?!1:!0)},2e3)}}function getSourceId(callback){if(!callback)throw'"callback" parameter is mandatory.';return sourceId?callback(sourceId):(screenCallback=callback,void window.postMessage("get-sourceId","*"))}function getSourceIdWithAudio(callback){if(!callback)throw'"callback" parameter is mandatory.';return sourceId?callback(sourceId):(screenCallback=callback,void window.postMessage("audio-plus-tab","*"))}function getChromeExtensionStatus(extensionid,callback){if(isFirefox)return callback("not-chrome");2!=arguments.length&&(callback=extensionid,extensionid="ajhifddimkapgcifgcodmmfdlknahffk");var image=document.createElement("img");image.src="chrome-extension://"+extensionid+"/icon.png",image.onload=function(){chromeMediaSource="screen",window.postMessage("are-you-there","*"),setTimeout(function(){callback("screen"==chromeMediaSource?"installed-disabled":"installed-enabled")},2e3)},image.onerror=function(){callback("not-installed")}}function getScreenConstraints(callback,captureSourceIdWithAudio){var firefoxScreenConstraints={mozMediaSource:"window",mediaSource:"window"};if(isFirefox)return callback(null,firefoxScreenConstraints);var screen_constraints={mandatory:{chromeMediaSource:chromeMediaSource,maxWidth:screen.width>1920?screen.width:1920,maxHeight:screen.height>1080?screen.height:1080},optional:[]};return"desktop"!=chromeMediaSource||sourceId?("desktop"==chromeMediaSource&&(screen_constraints.mandatory.chromeMediaSourceId=sourceId),void callback(null,screen_constraints)):void(captureSourceIdWithAudio?getSourceIdWithAudio(function(sourceId,canRequestAudioTrack){screen_constraints.mandatory.chromeMediaSourceId=sourceId,canRequestAudioTrack&&(screen_constraints.canRequestAudioTrack=!0),callback("PermissionDeniedError"==sourceId?sourceId:null,screen_constraints)}):getSourceId(function(sourceId){screen_constraints.mandatory.chromeMediaSourceId=sourceId,callback("PermissionDeniedError"==sourceId?sourceId:null,screen_constraints)}))}function TextReceiver(connection){function receive(data,userid,extra){var uuid=data.uuid;if(content[uuid]||(content[uuid]=[]),content[uuid].push(data.message),data.last){var message=content[uuid].join("");data.isobject&&(message=JSON.parse(message));var receivingTime=(new Date).getTime(),latency=receivingTime-data.sendingTime,e={data:message,userid:userid,extra:extra,latency:latency};connection.autoTranslateText?(e.original=e.data,connection.Translator.TranslateText(e.data,function(translatedText){e.data=translatedText,connection.onmessage(e)})):connection.onmessage(e),delete content[uuid]}}var content={};return{receive:receive}}var browserFakeUserAgent="Fake/5.0 (FakeOS) AppleWebKit/123 (KHTML, like Gecko) Fake/12.3.4567.89 Fake/123.45";!function(that){that&&"undefined"==typeof window&&"undefined"!=typeof global&&(global.navigator={userAgent:browserFakeUserAgent,getUserMedia:function(){}},global.console||(global.console={}),"undefined"==typeof global.console.debug&&(global.console.debug=global.console.info=global.console.error=global.console.log=global.console.log||function(){console.log(arguments)}),"undefined"==typeof document&&(that.document={},document.createElement=document.captureStream=document.mozCaptureStream=function(){var obj={getContext:function(){return obj},play:function(){},pause:function(){},drawImage:function(){},toDataURL:function(){return""}};return obj},document.addEventListener=document.removeEventListener=that.addEventListener=that.removeEventListener=function(){},that.HTMLVideoElement=that.HTMLMediaElement=function(){}),"undefined"==typeof io&&(that.io=function(){return{on:function(eventName,callback){callback=callback||function(){},"connect"===eventName&&callback()},emit:function(eventName,data,callback){callback=callback||function(){},"open-room"!==eventName&&"join-room"!==eventName||callback(!0,data.sessionid,null)}}}),"undefined"==typeof location&&(that.location={protocol:"file:",href:"",hash:"",origin:"self"}),"undefined"==typeof screen&&(that.screen={width:0,height:0}),"undefined"==typeof URL&&(that.URL={createObjectURL:function(){return""},revokeObjectURL:function(){return""}}),that.window=global)}("undefined"!=typeof global?global:null),function(){function getBrowserInfo(){var nameOffset,verOffset,ix,nAgt=(navigator.appVersion,navigator.userAgent),browserName=navigator.appName,fullVersion=""+parseFloat(navigator.appVersion),majorVersion=parseInt(navigator.appVersion,10);if(isSafari&&!isChrome&&nAgt.indexOf("CriOS")!==-1&&(isSafari=!1,isChrome=!0),isOpera){browserName="Opera";try{fullVersion=navigator.userAgent.split("OPR/")[1].split(" ")[0],majorVersion=fullVersion.split(".")[0]}catch(e){fullVersion="0.0.0.0",majorVersion=0}}else isIE?(verOffset=nAgt.indexOf("rv:"),verOffset>0?fullVersion=nAgt.substring(verOffset+3):(verOffset=nAgt.indexOf("MSIE"),fullVersion=nAgt.substring(verOffset+5)),browserName="IE"):isChrome?(verOffset=nAgt.indexOf("Chrome"),browserName="Chrome",fullVersion=nAgt.substring(verOffset+7)):isSafari?(verOffset=nAgt.indexOf("Safari"),browserName="Safari",fullVersion=nAgt.substring(verOffset+7),(verOffset=nAgt.indexOf("Version"))!==-1&&(fullVersion=nAgt.substring(verOffset+8)),navigator.userAgent.indexOf("Version/")!==-1&&(fullVersion=navigator.userAgent.split("Version/")[1].split(" ")[0])):isFirefox?(verOffset=nAgt.indexOf("Firefox"),browserName="Firefox",fullVersion=nAgt.substring(verOffset+8)):(nameOffset=nAgt.lastIndexOf(" ")+1)<(verOffset=nAgt.lastIndexOf("/"))&&(browserName=nAgt.substring(nameOffset,verOffset),fullVersion=nAgt.substring(verOffset+1),browserName.toLowerCase()===browserName.toUpperCase()&&(browserName=navigator.appName));return isEdge&&(browserName="Edge",fullVersion=navigator.userAgent.split("Edge/")[1]),(ix=fullVersion.search(/[; \)]/))!==-1&&(fullVersion=fullVersion.substring(0,ix)),majorVersion=parseInt(""+fullVersion,10),isNaN(majorVersion)&&(fullVersion=""+parseFloat(navigator.appVersion),majorVersion=parseInt(navigator.appVersion,10)),{fullVersion:fullVersion,version:majorVersion,name:browserName,isPrivateBrowsing:!1}}function retry(isDone,next){var currentTrial=0,maxRetry=50,isTimeout=!1,id=window.setInterval(function(){isDone()&&(window.clearInterval(id),next(isTimeout)),currentTrial++>maxRetry&&(window.clearInterval(id),isTimeout=!0,next(isTimeout))},10)}function isIE10OrLater(userAgent){var ua=userAgent.toLowerCase();if(0===ua.indexOf("msie")&&0===ua.indexOf("trident"))return!1;var match=/(?:msie|rv:)\s?([\d\.]+)/.exec(ua);return!!(match&&parseInt(match[1],10)>=10)}function detectPrivateMode(callback){var isPrivate;try{if(window.webkitRequestFileSystem)window.webkitRequestFileSystem(window.TEMPORARY,1,function(){isPrivate=!1},function(e){isPrivate=!0});else if(window.indexedDB&&/Firefox/.test(window.navigator.userAgent)){var db;try{db=window.indexedDB.open("test"),db.onerror=function(){return!0}}catch(e){isPrivate=!0}"undefined"==typeof isPrivate&&retry(function(){return"done"===db.readyState},function(isTimeout){isTimeout||(isPrivate=!db.result)})}else if(isIE10OrLater(window.navigator.userAgent)){isPrivate=!1;try{window.indexedDB||(isPrivate=!0)}catch(e){isPrivate=!0}}else if(window.localStorage&&/Safari/.test(window.navigator.userAgent)){try{window.localStorage.setItem("test",1)}catch(e){isPrivate=!0}"undefined"==typeof isPrivate&&(isPrivate=!1,window.localStorage.removeItem("test"))}}catch(e){isPrivate=!1}retry(function(){return"undefined"!=typeof isPrivate},function(isTimeout){callback(isPrivate)})}function detectDesktopOS(){for(var cs,unknown="-",nVer=navigator.appVersion,nAgt=navigator.userAgent,os=unknown,clientStrings=[{s:"Windows 10",r:/(Windows 10.0|Windows NT 10.0)/},{s:"Windows 8.1",r:/(Windows 8.1|Windows NT 6.3)/},{s:"Windows 8",r:/(Windows 8|Windows NT 6.2)/},{s:"Windows 7",r:/(Windows 7|Windows NT 6.1)/},{s:"Windows Vista",r:/Windows NT 6.0/},{s:"Windows Server 2003",r:/Windows NT 5.2/},{s:"Windows XP",r:/(Windows NT 5.1|Windows XP)/},{s:"Windows 2000",r:/(Windows NT 5.0|Windows 2000)/},{s:"Windows ME",r:/(Win 9x 4.90|Windows ME)/},{s:"Windows 98",r:/(Windows 98|Win98)/},{s:"Windows 95",r:/(Windows 95|Win95|Windows_95)/},{s:"Windows NT 4.0",r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},{s:"Windows CE",r:/Windows CE/},{s:"Windows 3.11",r:/Win16/},{s:"Android",r:/Android/},{s:"Open BSD",r:/OpenBSD/},{s:"Sun OS",r:/SunOS/},{s:"Linux",r:/(Linux|X11)/},{s:"iOS",r:/(iPhone|iPad|iPod)/},{s:"Mac OS X",r:/Mac OS X/},{s:"Mac OS",r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},{s:"QNX",r:/QNX/},{s:"UNIX",r:/UNIX/},{s:"BeOS",r:/BeOS/},{s:"OS/2",r:/OS\/2/},{s:"Search Bot",r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}],i=0;cs=clientStrings[i];i++)if(cs.r.test(nAgt)){os=cs.s;break}var osVersion=unknown;switch(/Windows/.test(os)&&(/Windows (.*)/.test(os)&&(osVersion=/Windows (.*)/.exec(os)[1]),os="Windows"),os){case"Mac OS X":/Mac OS X (10[\.\_\d]+)/.test(nAgt)&&(osVersion=/Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1]);break;case"Android":/Android ([\.\_\d]+)/.test(nAgt)&&(osVersion=/Android ([\.\_\d]+)/.exec(nAgt)[1]);break;case"iOS":/OS (\d+)_(\d+)_?(\d+)?/.test(nAgt)&&(osVersion=/OS (\d+)_(\d+)_?(\d+)?/.exec(nVer),osVersion=osVersion[1]+"."+osVersion[2]+"."+(0|osVersion[3]))}return{osName:os,osVersion:osVersion}}function getAndroidVersion(ua){ua=(ua||navigator.userAgent).toLowerCase();var match=ua.match(/android\s([0-9\.]*)/);return!!match&&match[1]}function DetectLocalIPAddress(callback,stream){if(DetectRTC.isWebRTCSupported){var isPublic=!0,isIpv4=!0;getIPs(function(ip){ip?ip.match(regexIpv4Local)?(isPublic=!1,callback("Local: "+ip,isPublic,isIpv4)):ip.match(regexIpv6)?(isIpv4=!1,callback("Public: "+ip,isPublic,isIpv4)):callback("Public: "+ip,isPublic,isIpv4):callback()},stream)}}function getIPs(callback,stream){function handleCandidate(candidate){if(!candidate)return void callback();var match=regexIpv4.exec(candidate);if(match){var ipAddress=match[1],isPublic=candidate.match(regexIpv4Local),isIpv4=!0;void 0===ipDuplicates[ipAddress]&&callback(ipAddress,isPublic,isIpv4),ipDuplicates[ipAddress]=!0}}function afterCreateOffer(){var lines=pc.localDescription.sdp.split("\n");lines.forEach(function(line){line&&0===line.indexOf("a=candidate:")&&handleCandidate(line)})}if("undefined"!=typeof document&&"function"==typeof document.getElementById){var ipDuplicates={},RTCPeerConnection=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection;if(!RTCPeerConnection){var iframe=document.getElementById("iframe");if(!iframe)return;var win=iframe.contentWindow;RTCPeerConnection=win.RTCPeerConnection||win.mozRTCPeerConnection||win.webkitRTCPeerConnection}if(RTCPeerConnection){var peerConfig=null;"Chrome"===DetectRTC.browser&&DetectRTC.browser.version<58&&(peerConfig={optional:[{RtpDataChannels:!0}]});var servers={iceServers:[{urls:"stun:stun.l.google.com:19302"}]},pc=new RTCPeerConnection(servers,peerConfig);if(stream&&(pc.addStream?pc.addStream(stream):pc.addTrack&&stream.getTracks()[0]&&pc.addTrack(stream.getTracks()[0],stream)),pc.onicecandidate=function(event){event.candidate&&event.candidate.candidate?handleCandidate(event.candidate.candidate):handleCandidate()},!stream)try{pc.createDataChannel("sctp",{})}catch(e){}DetectRTC.isPromisesSupported?pc.createOffer().then(function(result){pc.setLocalDescription(result).then(afterCreateOffer)}):pc.createOffer(function(result){pc.setLocalDescription(result,afterCreateOffer,function(){})},function(){})}}}function checkDeviceSupport(callback){if(!canEnumerate)return void(callback&&callback());if(!navigator.enumerateDevices&&window.MediaStreamTrack&&window.MediaStreamTrack.getSources&&(navigator.enumerateDevices=window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack)),!navigator.enumerateDevices&&navigator.enumerateDevices&&(navigator.enumerateDevices=navigator.enumerateDevices.bind(navigator)),!navigator.enumerateDevices)return void(callback&&callback());MediaDevices=[],audioInputDevices=[],audioOutputDevices=[],videoInputDevices=[],hasMicrophone=!1,hasSpeakers=!1,hasWebcam=!1,isWebsiteHasMicrophonePermissions=!1,isWebsiteHasWebcamPermissions=!1;var alreadyUsedDevices={};navigator.enumerateDevices(function(devices){devices.forEach(function(_device){var device={};for(var d in _device)try{"function"!=typeof _device[d]&&(device[d]=_device[d])}catch(e){}alreadyUsedDevices[device.deviceId+device.label+device.kind]||("audio"===device.kind&&(device.kind="audioinput"),"video"===device.kind&&(device.kind="videoinput"),device.deviceId||(device.deviceId=device.id),device.id||(device.id=device.deviceId),device.label?("videoinput"!==device.kind||isWebsiteHasWebcamPermissions||(isWebsiteHasWebcamPermissions=!0),"audioinput"!==device.kind||isWebsiteHasMicrophonePermissions||(isWebsiteHasMicrophonePermissions=!0)):(device.isCustomLabel=!0,"videoinput"===device.kind?device.label="Camera "+(videoInputDevices.length+1):"audioinput"===device.kind?device.label="Microphone "+(audioInputDevices.length+1):"audiooutput"===device.kind?device.label="Speaker "+(audioOutputDevices.length+1):device.label="Please invoke getUserMedia once.","undefined"!=typeof DetectRTC&&DetectRTC.browser.isChrome&&DetectRTC.browser.version>=46&&!/^(https:|chrome-extension:)$/g.test(location.protocol||"")&&"undefined"!=typeof document&&"string"==typeof document.domain&&document.domain.search&&document.domain.search(/localhost|127.0./g)===-1&&(device.label="HTTPs is required to get label of this "+device.kind+" device.")),"audioinput"===device.kind&&(hasMicrophone=!0,audioInputDevices.indexOf(device)===-1&&audioInputDevices.push(device)),"audiooutput"===device.kind&&(hasSpeakers=!0,audioOutputDevices.indexOf(device)===-1&&audioOutputDevices.push(device)),"videoinput"===device.kind&&(hasWebcam=!0,videoInputDevices.indexOf(device)===-1&&videoInputDevices.push(device)),MediaDevices.push(device),alreadyUsedDevices[device.deviceId+device.label+device.kind]=device)}),"undefined"!=typeof DetectRTC&&(DetectRTC.MediaDevices=MediaDevices,DetectRTC.hasMicrophone=hasMicrophone,DetectRTC.hasSpeakers=hasSpeakers,DetectRTC.hasWebcam=hasWebcam,DetectRTC.isWebsiteHasWebcamPermissions=isWebsiteHasWebcamPermissions,DetectRTC.isWebsiteHasMicrophonePermissions=isWebsiteHasMicrophonePermissions,DetectRTC.audioInputDevices=audioInputDevices,DetectRTC.audioOutputDevices=audioOutputDevices,DetectRTC.videoInputDevices=videoInputDevices),callback&&callback()})}function getAspectRatio(w,h){function gcd(a,b){return 0==b?a:gcd(b,a%b)}var r=gcd(w,h);return w/r/(h/r)}var browserFakeUserAgent="Fake/5.0 (FakeOS) AppleWebKit/123 (KHTML, like Gecko) Fake/12.3.4567.89 Fake/123.45",isNodejs="object"==typeof process&&"object"==typeof process.versions&&process.versions.node&&!process.browser;if(isNodejs){var version=process.versions.node.toString().replace("v","");browserFakeUserAgent="Nodejs/"+version+" (NodeOS) AppleWebKit/"+version+" (KHTML, like Gecko) Nodejs/"+version+" Nodejs/"+version}!function(that){"undefined"==typeof window&&("undefined"==typeof window&&"undefined"!=typeof global?(global.navigator={userAgent:browserFakeUserAgent,getUserMedia:function(){}},that.window=global):"undefined"==typeof window,"undefined"==typeof location&&(that.location={protocol:"file:",href:"",hash:""}),"undefined"==typeof screen&&(that.screen={width:0,height:0}))}("undefined"!=typeof global?global:window);var navigator=window.navigator;"undefined"!=typeof navigator?("undefined"!=typeof navigator.webkitGetUserMedia&&(navigator.getUserMedia=navigator.webkitGetUserMedia),"undefined"!=typeof navigator.mozGetUserMedia&&(navigator.getUserMedia=navigator.mozGetUserMedia)):navigator={getUserMedia:function(){},userAgent:browserFakeUserAgent};var isMobileDevice=!!/Android|webOS|iPhone|iPad|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent||""),isEdge=!(navigator.userAgent.indexOf("Edge")===-1||!navigator.msSaveOrOpenBlob&&!navigator.msSaveBlob),isOpera=!!window.opera||navigator.userAgent.indexOf(" OPR/")>=0,isFirefox="undefined"!=typeof window.InstallTrigger,isSafari=/^((?!chrome|android).)*safari/i.test(navigator.userAgent),isChrome=!!window.chrome&&!isOpera,isIE="undefined"!=typeof document&&!!document.documentMode&&!isEdge,isMobile={Android:function(){return navigator.userAgent.match(/Android/i)},BlackBerry:function(){return navigator.userAgent.match(/BlackBerry|BB10/i)},iOS:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i)},Opera:function(){return navigator.userAgent.match(/Opera Mini/i)},Windows:function(){return navigator.userAgent.match(/IEMobile/i)},any:function(){return isMobile.Android()||isMobile.BlackBerry()||isMobile.iOS()||isMobile.Opera()||isMobile.Windows()},getOsName:function(){var osName="Unknown OS";return isMobile.Android()&&(osName="Android"),isMobile.BlackBerry()&&(osName="BlackBerry"),isMobile.iOS()&&(osName="iOS"),isMobile.Opera()&&(osName="Opera Mini"),isMobile.Windows()&&(osName="Windows"),osName}},osName="Unknown OS",osVersion="Unknown OS Version",osInfo=detectDesktopOS();osInfo&&osInfo.osName&&"-"!=osInfo.osName?(osName=osInfo.osName,osVersion=osInfo.osVersion):isMobile.any()&&(osName=isMobile.getOsName(),"Android"==osName&&(osVersion=getAndroidVersion()));var isNodejs="object"==typeof process&&"object"==typeof process.versions&&process.versions.node;"Unknown OS"===osName&&isNodejs&&(osName="Nodejs",osVersion=process.versions.node.toString().replace("v",""));var isCanvasSupportsStreamCapturing=!1,isVideoSupportsStreamCapturing=!1;["captureStream","mozCaptureStream","webkitCaptureStream"].forEach(function(item){"undefined"!=typeof document&&"function"==typeof document.createElement&&(!isCanvasSupportsStreamCapturing&&item in document.createElement("canvas")&&(isCanvasSupportsStreamCapturing=!0),!isVideoSupportsStreamCapturing&&item in document.createElement("video")&&(isVideoSupportsStreamCapturing=!0))});var regexIpv4Local=/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/,regexIpv4=/([0-9]{1,3}(\.[0-9]{1,3}){3})/,regexIpv6=/[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}/,MediaDevices=[],audioInputDevices=[],audioOutputDevices=[],videoInputDevices=[];navigator.mediaDevices&&navigator.mediaDevices.enumerateDevices&&(navigator.enumerateDevices=function(callback){var enumerateDevices=navigator.mediaDevices.enumerateDevices();enumerateDevices&&enumerateDevices.then?navigator.mediaDevices.enumerateDevices().then(callback)["catch"](function(){callback([])}):callback([])});var canEnumerate=!1;"undefined"!=typeof MediaStreamTrack&&"getSources"in MediaStreamTrack?canEnumerate=!0:navigator.mediaDevices&&navigator.mediaDevices.enumerateDevices&&(canEnumerate=!0);var hasMicrophone=!1,hasSpeakers=!1,hasWebcam=!1,isWebsiteHasMicrophonePermissions=!1,isWebsiteHasWebcamPermissions=!1,DetectRTC=window.DetectRTC||{};DetectRTC.browser=getBrowserInfo(),detectPrivateMode(function(isPrivateBrowsing){DetectRTC.browser.isPrivateBrowsing=!!isPrivateBrowsing}),DetectRTC.browser["is"+DetectRTC.browser.name]=!0,DetectRTC.osName=osName,DetectRTC.osVersion=osVersion;var isWebRTCSupported=("object"==typeof process&&"object"==typeof process.versions&&process.versions["node-webkit"],!1);["RTCPeerConnection","webkitRTCPeerConnection","mozRTCPeerConnection","RTCIceGatherer"].forEach(function(item){isWebRTCSupported||item in window&&(isWebRTCSupported=!0)}),DetectRTC.isWebRTCSupported=isWebRTCSupported,DetectRTC.isORTCSupported="undefined"!=typeof RTCIceGatherer;var isScreenCapturingSupported=!1;if(DetectRTC.browser.isChrome&&DetectRTC.browser.version>=35?isScreenCapturingSupported=!0:DetectRTC.browser.isFirefox&&DetectRTC.browser.version>=34?isScreenCapturingSupported=!0:DetectRTC.browser.isEdge&&DetectRTC.browser.version>=17?isScreenCapturingSupported=!0:"Android"===DetectRTC.osName&&DetectRTC.browser.isChrome&&(isScreenCapturingSupported=!0),!/^(https:|chrome-extension:)$/g.test(location.protocol||"")){var isNonLocalHost="undefined"!=typeof document&&"string"==typeof document.domain&&document.domain.search&&document.domain.search(/localhost|127.0./g)===-1;isNonLocalHost&&(DetectRTC.browser.isChrome||DetectRTC.browser.isEdge||DetectRTC.browser.isOpera)?isScreenCapturingSupported=!1:DetectRTC.browser.isFirefox&&(isScreenCapturingSupported=!1)}DetectRTC.isScreenCapturingSupported=isScreenCapturingSupported;var webAudio={isSupported:!1,isCreateMediaStreamSourceSupported:!1};["AudioContext","webkitAudioContext","mozAudioContext","msAudioContext"].forEach(function(item){webAudio.isSupported||item in window&&(webAudio.isSupported=!0,window[item]&&"createMediaStreamSource"in window[item].prototype&&(webAudio.isCreateMediaStreamSourceSupported=!0))}),DetectRTC.isAudioContextSupported=webAudio.isSupported,DetectRTC.isCreateMediaStreamSourceSupported=webAudio.isCreateMediaStreamSourceSupported;var isRtpDataChannelsSupported=!1;DetectRTC.browser.isChrome&&DetectRTC.browser.version>31&&(isRtpDataChannelsSupported=!0),DetectRTC.isRtpDataChannelsSupported=isRtpDataChannelsSupported;var isSCTPSupportd=!1;DetectRTC.browser.isFirefox&&DetectRTC.browser.version>28?isSCTPSupportd=!0:DetectRTC.browser.isChrome&&DetectRTC.browser.version>25?isSCTPSupportd=!0:DetectRTC.browser.isOpera&&DetectRTC.browser.version>=11&&(isSCTPSupportd=!0),DetectRTC.isSctpDataChannelsSupported=isSCTPSupportd,DetectRTC.isMobileDevice=isMobileDevice;var isGetUserMediaSupported=!1;navigator.getUserMedia?isGetUserMediaSupported=!0:navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&(isGetUserMediaSupported=!0),DetectRTC.browser.isChrome&&DetectRTC.browser.version>=46&&!/^(https:|chrome-extension:)$/g.test(location.protocol||"")&&"undefined"!=typeof document&&"string"==typeof document.domain&&document.domain.search&&document.domain.search(/localhost|127.0./g)===-1&&(isGetUserMediaSupported="Requires HTTPs"),"Nodejs"===DetectRTC.osName&&(isGetUserMediaSupported=!1),DetectRTC.isGetUserMediaSupported=isGetUserMediaSupported;var displayResolution="";if(screen.width){var width=screen.width?screen.width:"",height=screen.height?screen.height:"";displayResolution+=""+width+" x "+height}DetectRTC.displayResolution=displayResolution,DetectRTC.displayAspectRatio=getAspectRatio(screen.width,screen.height).toFixed(2),DetectRTC.isCanvasSupportsStreamCapturing=isCanvasSupportsStreamCapturing,DetectRTC.isVideoSupportsStreamCapturing=isVideoSupportsStreamCapturing,"Chrome"==DetectRTC.browser.name&&DetectRTC.browser.version>=53&&(DetectRTC.isCanvasSupportsStreamCapturing||(DetectRTC.isCanvasSupportsStreamCapturing="Requires chrome flag: enable-experimental-web-platform-features"),DetectRTC.isVideoSupportsStreamCapturing||(DetectRTC.isVideoSupportsStreamCapturing="Requires chrome flag: enable-experimental-web-platform-features")),DetectRTC.DetectLocalIPAddress=DetectLocalIPAddress,DetectRTC.isWebSocketsSupported="WebSocket"in window&&2===window.WebSocket.CLOSING,DetectRTC.isWebSocketsBlocked=!DetectRTC.isWebSocketsSupported,"Nodejs"===DetectRTC.osName&&(DetectRTC.isWebSocketsSupported=!0,DetectRTC.isWebSocketsBlocked=!1),DetectRTC.checkWebSocketsSupport=function(callback){callback=callback||function(){};try{var starttime,websocket=new WebSocket("wss://echo.websocket.org:443/");websocket.onopen=function(){DetectRTC.isWebSocketsBlocked=!1,starttime=(new Date).getTime(),websocket.send("ping")},websocket.onmessage=function(){DetectRTC.WebsocketLatency=(new Date).getTime()-starttime+"ms",callback(),websocket.close(),websocket=null},websocket.onerror=function(){DetectRTC.isWebSocketsBlocked=!0,callback()}}catch(e){DetectRTC.isWebSocketsBlocked=!0,callback()}},DetectRTC.load=function(callback){callback=callback||function(){},checkDeviceSupport(callback)},"undefined"!=typeof MediaDevices?DetectRTC.MediaDevices=MediaDevices:DetectRTC.MediaDevices=[],DetectRTC.hasMicrophone=hasMicrophone,DetectRTC.hasSpeakers=hasSpeakers,DetectRTC.hasWebcam=hasWebcam,DetectRTC.isWebsiteHasWebcamPermissions=isWebsiteHasWebcamPermissions,DetectRTC.isWebsiteHasMicrophonePermissions=isWebsiteHasMicrophonePermissions,DetectRTC.audioInputDevices=audioInputDevices,DetectRTC.audioOutputDevices=audioOutputDevices,DetectRTC.videoInputDevices=videoInputDevices;var isSetSinkIdSupported=!1;"undefined"!=typeof document&&"function"==typeof document.createElement&&"setSinkId"in document.createElement("video")&&(isSetSinkIdSupported=!0),DetectRTC.isSetSinkIdSupported=isSetSinkIdSupported;var isRTPSenderReplaceTracksSupported=!1;DetectRTC.browser.isFirefox&&"undefined"!=typeof mozRTCPeerConnection?"getSenders"in mozRTCPeerConnection.prototype&&(isRTPSenderReplaceTracksSupported=!0):DetectRTC.browser.isChrome&&"undefined"!=typeof webkitRTCPeerConnection&&"getSenders"in webkitRTCPeerConnection.prototype&&(isRTPSenderReplaceTracksSupported=!0),
DetectRTC.isRTPSenderReplaceTracksSupported=isRTPSenderReplaceTracksSupported;var isRemoteStreamProcessingSupported=!1;DetectRTC.browser.isFirefox&&DetectRTC.browser.version>38&&(isRemoteStreamProcessingSupported=!0),DetectRTC.isRemoteStreamProcessingSupported=isRemoteStreamProcessingSupported;var isApplyConstraintsSupported=!1;"undefined"!=typeof MediaStreamTrack&&"applyConstraints"in MediaStreamTrack.prototype&&(isApplyConstraintsSupported=!0),DetectRTC.isApplyConstraintsSupported=isApplyConstraintsSupported;var isMultiMonitorScreenCapturingSupported=!1;DetectRTC.browser.isFirefox&&DetectRTC.browser.version>=43&&(isMultiMonitorScreenCapturingSupported=!0),DetectRTC.isMultiMonitorScreenCapturingSupported=isMultiMonitorScreenCapturingSupported,DetectRTC.isPromisesSupported=!!("Promise"in window),DetectRTC.version="1.3.9","undefined"==typeof DetectRTC&&(window.DetectRTC={});var MediaStream=window.MediaStream;"undefined"==typeof MediaStream&&"undefined"!=typeof webkitMediaStream&&(MediaStream=webkitMediaStream),"undefined"!=typeof MediaStream&&"function"==typeof MediaStream?DetectRTC.MediaStream=Object.keys(MediaStream.prototype):DetectRTC.MediaStream=!1,"undefined"!=typeof MediaStreamTrack?DetectRTC.MediaStreamTrack=Object.keys(MediaStreamTrack.prototype):DetectRTC.MediaStreamTrack=!1;var RTCPeerConnection=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection;"undefined"!=typeof RTCPeerConnection?DetectRTC.RTCPeerConnection=Object.keys(RTCPeerConnection.prototype):DetectRTC.RTCPeerConnection=!1,window.DetectRTC=DetectRTC,"undefined"!=typeof module&&(module.exports=DetectRTC),"function"==typeof define&&define.amd&&define("DetectRTC",[],function(){return DetectRTC})}(),"undefined"!=typeof cordova&&(DetectRTC.isMobileDevice=!0,DetectRTC.browser.name="Chrome"),navigator&&navigator.userAgent&&navigator.userAgent.indexOf("Crosswalk")!==-1&&(DetectRTC.isMobileDevice=!0,DetectRTC.browser.name="Chrome"),window.addEventListener||(window.addEventListener=function(el,eventName,eventHandler){el.attachEvent&&el.attachEvent("on"+eventName,eventHandler)}),window.attachEventListener=function(video,type,listener,useCapture){video.addEventListener(type,listener,useCapture)};var MediaStream=window.MediaStream;"undefined"==typeof MediaStream&&"undefined"!=typeof webkitMediaStream&&(MediaStream=webkitMediaStream),"undefined"!=typeof MediaStream&&("stop"in MediaStream.prototype||(MediaStream.prototype.stop=function(){this.getTracks().forEach(function(track){track.stop()})})),window.iOSDefaultAudioOutputDevice=window.iOSDefaultAudioOutputDevice||"speaker",document.addEventListener("deviceready",setCordovaAPIs,!1),setCordovaAPIs();var RTCPeerConnection,defaults={};"undefined"!=typeof window.RTCPeerConnection?RTCPeerConnection=window.RTCPeerConnection:"undefined"!=typeof mozRTCPeerConnection?RTCPeerConnection=mozRTCPeerConnection:"undefined"!=typeof webkitRTCPeerConnection&&(RTCPeerConnection=webkitRTCPeerConnection);var RTCSessionDescription=window.RTCSessionDescription||window.mozRTCSessionDescription,RTCIceCandidate=window.RTCIceCandidate||window.mozRTCIceCandidate,MediaStreamTrack=window.MediaStreamTrack,CodecsHandler=function(){function preferCodec(sdp,codecName){var info=splitLines(sdp);return info.videoCodecNumbers?"vp8"===codecName&&info.vp8LineNumber===info.videoCodecNumbers[0]?sdp:"vp9"===codecName&&info.vp9LineNumber===info.videoCodecNumbers[0]?sdp:"h264"===codecName&&info.h264LineNumber===info.videoCodecNumbers[0]?sdp:sdp=preferCodecHelper(sdp,codecName,info):sdp}function preferCodecHelper(sdp,codec,info,ignore){var preferCodecNumber="";if("vp8"===codec){if(!info.vp8LineNumber)return sdp;preferCodecNumber=info.vp8LineNumber}if("vp9"===codec){if(!info.vp9LineNumber)return sdp;preferCodecNumber=info.vp9LineNumber}if("h264"===codec){if(!info.h264LineNumber)return sdp;preferCodecNumber=info.h264LineNumber}var newLine=info.videoCodecNumbersOriginal.split("SAVPF")[0]+"SAVPF ",newOrder=[preferCodecNumber];return ignore&&(newOrder=[]),info.videoCodecNumbers.forEach(function(codecNumber){codecNumber!==preferCodecNumber&&newOrder.push(codecNumber)}),newLine+=newOrder.join(" "),sdp=sdp.replace(info.videoCodecNumbersOriginal,newLine)}function splitLines(sdp){var info={};return sdp.split("\n").forEach(function(line){0===line.indexOf("m=video")&&(info.videoCodecNumbers=[],line.split("SAVPF")[1].split(" ").forEach(function(codecNumber){codecNumber=codecNumber.trim(),codecNumber&&codecNumber.length&&(info.videoCodecNumbers.push(codecNumber),info.videoCodecNumbersOriginal=line)})),line.indexOf("VP8/90000")===-1||info.vp8LineNumber||(info.vp8LineNumber=line.replace("a=rtpmap:","").split(" ")[0]),line.indexOf("VP9/90000")===-1||info.vp9LineNumber||(info.vp9LineNumber=line.replace("a=rtpmap:","").split(" ")[0]),line.indexOf("H264/90000")===-1||info.h264LineNumber||(info.h264LineNumber=line.replace("a=rtpmap:","").split(" ")[0])}),info}function removeVPX(sdp){var info=splitLines(sdp);return sdp=preferCodecHelper(sdp,"vp9",info,!0),sdp=preferCodecHelper(sdp,"vp8",info,!0)}function disableNACK(sdp){if(!sdp||"string"!=typeof sdp)throw"Invalid arguments.";return sdp=sdp.replace("a=rtcp-fb:126 nack\r\n",""),sdp=sdp.replace("a=rtcp-fb:126 nack pli\r\n","a=rtcp-fb:126 pli\r\n"),sdp=sdp.replace("a=rtcp-fb:97 nack\r\n",""),sdp=sdp.replace("a=rtcp-fb:97 nack pli\r\n","a=rtcp-fb:97 pli\r\n")}function prioritize(codecMimeType,peer){if(peer&&peer.getSenders&&peer.getSenders().length){if(!codecMimeType||"string"!=typeof codecMimeType)throw"Invalid arguments.";peer.getSenders().forEach(function(sender){for(var params=sender.getParameters(),i=0;i<params.codecs.length;i++)if(params.codecs[i].mimeType==codecMimeType){params.codecs.unshift(params.codecs.splice(i,1));break}sender.setParameters(params)})}}function removeNonG722(sdp){return sdp.replace(/m=audio ([0-9]+) RTP\/SAVPF ([0-9 ]*)/g,"m=audio $1 RTP/SAVPF 9")}function setBAS(sdp,bandwidth,isScreen){return bandwidth?"undefined"!=typeof isFirefox&&isFirefox?sdp:(isScreen&&(bandwidth.screen?bandwidth.screen<300&&console.warn("It seems that you are using wrong bandwidth value for screen. Screen sharing is expected to fail."):console.warn("It seems that you are not using bandwidth for screen. Screen sharing is expected to fail.")),bandwidth.screen&&isScreen&&(sdp=sdp.replace(/b=AS([^\r\n]+\r\n)/g,""),sdp=sdp.replace(/a=mid:video\r\n/g,"a=mid:video\r\nb=AS:"+bandwidth.screen+"\r\n")),(bandwidth.audio||bandwidth.video)&&(sdp=sdp.replace(/b=AS([^\r\n]+\r\n)/g,"")),bandwidth.audio&&(sdp=sdp.replace(/a=mid:audio\r\n/g,"a=mid:audio\r\nb=AS:"+bandwidth.audio+"\r\n")),bandwidth.screen?sdp=sdp.replace(/a=mid:video\r\n/g,"a=mid:video\r\nb=AS:"+bandwidth.screen+"\r\n"):bandwidth.video&&(sdp=sdp.replace(/a=mid:video\r\n/g,"a=mid:video\r\nb=AS:"+bandwidth.video+"\r\n")),sdp):sdp}function findLine(sdpLines,prefix,substr){return findLineInRange(sdpLines,0,-1,prefix,substr)}function findLineInRange(sdpLines,startLine,endLine,prefix,substr){for(var realEndLine=endLine!==-1?endLine:sdpLines.length,i=startLine;i<realEndLine;++i)if(0===sdpLines[i].indexOf(prefix)&&(!substr||sdpLines[i].toLowerCase().indexOf(substr.toLowerCase())!==-1))return i;return null}function getCodecPayloadType(sdpLine){var pattern=new RegExp("a=rtpmap:(\\d+) \\w+\\/\\d+"),result=sdpLine.match(pattern);return result&&2===result.length?result[1]:null}function setVideoBitrates(sdp,params){params=params||{};var vp8Payload,xgoogle_min_bitrate=params.min,xgoogle_max_bitrate=params.max,sdpLines=sdp.split("\r\n"),vp8Index=findLine(sdpLines,"a=rtpmap","VP8/90000");if(vp8Index&&(vp8Payload=getCodecPayloadType(sdpLines[vp8Index])),!vp8Payload)return sdp;var rtxPayload,rtxIndex=findLine(sdpLines,"a=rtpmap","rtx/90000");if(rtxIndex&&(rtxPayload=getCodecPayloadType(sdpLines[rtxIndex])),!rtxIndex)return sdp;var rtxFmtpLineIndex=findLine(sdpLines,"a=fmtp:"+rtxPayload.toString());if(null!==rtxFmtpLineIndex){var appendrtxNext="\r\n";appendrtxNext+="a=fmtp:"+vp8Payload+" x-google-min-bitrate="+(xgoogle_min_bitrate||"228")+"; x-google-max-bitrate="+(xgoogle_max_bitrate||"228"),sdpLines[rtxFmtpLineIndex]=sdpLines[rtxFmtpLineIndex].concat(appendrtxNext),sdp=sdpLines.join("\r\n")}return sdp}function setOpusAttributes(sdp,params){params=params||{};var opusPayload,sdpLines=sdp.split("\r\n"),opusIndex=findLine(sdpLines,"a=rtpmap","opus/48000");if(opusIndex&&(opusPayload=getCodecPayloadType(sdpLines[opusIndex])),!opusPayload)return sdp;var opusFmtpLineIndex=findLine(sdpLines,"a=fmtp:"+opusPayload.toString());if(null===opusFmtpLineIndex)return sdp;var appendOpusNext="";return appendOpusNext+="; stereo="+("undefined"!=typeof params.stereo?params.stereo:"1"),appendOpusNext+="; sprop-stereo="+("undefined"!=typeof params["sprop-stereo"]?params["sprop-stereo"]:"1"),"undefined"!=typeof params.maxaveragebitrate&&(appendOpusNext+="; maxaveragebitrate="+(params.maxaveragebitrate||1048576)),"undefined"!=typeof params.maxplaybackrate&&(appendOpusNext+="; maxplaybackrate="+(params.maxplaybackrate||1048576)),"undefined"!=typeof params.cbr&&(appendOpusNext+="; cbr="+("undefined"!=typeof params.cbr?params.cbr:"1")),"undefined"!=typeof params.useinbandfec&&(appendOpusNext+="; useinbandfec="+params.useinbandfec),"undefined"!=typeof params.usedtx&&(appendOpusNext+="; usedtx="+params.usedtx),"undefined"!=typeof params.maxptime&&(appendOpusNext+="\r\na=maxptime:"+params.maxptime),sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].concat(appendOpusNext),sdp=sdpLines.join("\r\n")}function forceStereoAudio(sdp){for(var sdpLines=sdp.split("\r\n"),fmtpLineIndex=null,i=0;i<sdpLines.length;i++)if(sdpLines[i].search("opus/48000")!==-1){var opusPayload=extractSdp(sdpLines[i],/:(\d+) opus\/48000/i);break}for(var i=0;i<sdpLines.length;i++)if(sdpLines[i].search("a=fmtp")!==-1){var payload=extractSdp(sdpLines[i],/a=fmtp:(\d+)/);if(payload===opusPayload){fmtpLineIndex=i;break}}return null===fmtpLineIndex?sdp:(sdpLines[fmtpLineIndex]=sdpLines[fmtpLineIndex].concat("; stereo=1; sprop-stereo=1"),sdp=sdpLines.join("\r\n"))}return{removeVPX:removeVPX,disableNACK:disableNACK,prioritize:prioritize,removeNonG722:removeNonG722,setApplicationSpecificBandwidth:function(sdp,bandwidth,isScreen){return setBAS(sdp,bandwidth,isScreen)},setVideoBitrates:function(sdp,params){return setVideoBitrates(sdp,params)},setOpusAttributes:function(sdp,params){return setOpusAttributes(sdp,params)},preferVP9:function(sdp){return preferCodec(sdp,"vp9")},preferCodec:preferCodec,forceStereoAudio:forceStereoAudio}}();window.BandwidthHandler=CodecsHandler;var OnIceCandidateHandler=function(){function processCandidates(connection,icePair){var candidate=icePair.candidate,iceRestrictions=connection.candidates,stun=iceRestrictions.stun,turn=iceRestrictions.turn;if(isNull(iceRestrictions.reflexive)||(stun=iceRestrictions.reflexive),isNull(iceRestrictions.relay)||(turn=iceRestrictions.relay),(iceRestrictions.host||!candidate.match(/typ host/g))&&(turn||!candidate.match(/typ relay/g))&&(stun||!candidate.match(/typ srflx/g))){var protocol=connection.iceProtocols;if((protocol.udp||!candidate.match(/ udp /g))&&(protocol.tcp||!candidate.match(/ tcp /g)))return connection.enableLogs&&console.debug("Your candidate pairs:",candidate),{candidate:candidate,sdpMid:icePair.sdpMid,sdpMLineIndex:icePair.sdpMLineIndex}}}return{processCandidates:processCandidates}}(),IceServersHandler=function(){function getIceServers(connection){var iceServers=[{urls:["stun:stun.l.google.com:19302","stun:stun1.l.google.com:19302","stun:stun2.l.google.com:19302","stun:stun.l.google.com:19302?transport=udp"]}];return iceServers}return{getIceServers:getIceServers}}();window.currentUserMediaRequest={streams:[],mutex:!1,queueRequests:[],remove:function(idInstance){this.mutex=!1;var stream=this.streams[idInstance];if(stream){stream=stream.stream;var options=stream.currentUserMediaRequestOptions;this.queueRequests.indexOf(options)&&(delete this.queueRequests[this.queueRequests.indexOf(options)],this.queueRequests=removeNullEntries(this.queueRequests)),this.streams[idInstance].stream=null,delete this.streams[idInstance]}}};var StreamsHandler=function(){function handleType(type){if(type)return"string"==typeof type||"undefined"==typeof type?type:type.audio&&type.video?null:type.audio?"audio":type.video?"video":void 0}function setHandlers(stream,syncAction,connection){function graduallyIncreaseVolume(){if(connection.streamEvents[stream.streamid].mediaElement){var mediaElement=connection.streamEvents[stream.streamid].mediaElement;mediaElement.volume=0,afterEach(200,5,function(){try{mediaElement.volume+=.2}catch(e){mediaElement.volume=1}})}}if(stream&&stream.addEventListener){if("undefined"==typeof syncAction||1==syncAction){var streamEndedEvent="ended";"oninactive"in stream&&(streamEndedEvent="inactive"),stream.addEventListener(streamEndedEvent,function(){StreamsHandler.onSyncNeeded(this.streamid,streamEndedEvent)},!1)}stream.mute=function(type,isSyncAction){type=handleType(type),"undefined"!=typeof isSyncAction&&(syncAction=isSyncAction),"undefined"!=typeof type&&"audio"!=type||getTracks(stream,"audio").forEach(function(track){track.enabled=!1,connection.streamEvents[stream.streamid].isAudioMuted=!0}),"undefined"!=typeof type&&"video"!=type||getTracks(stream,"video").forEach(function(track){track.enabled=!1}),"undefined"!=typeof syncAction&&1!=syncAction||StreamsHandler.onSyncNeeded(stream.streamid,"mute",type),connection.streamEvents[stream.streamid].muteType=type||"both",fireEvent(stream,"mute",type)},stream.unmute=function(type,isSyncAction){type=handleType(type),"undefined"!=typeof isSyncAction&&(syncAction=isSyncAction),graduallyIncreaseVolume(),"undefined"!=typeof type&&"audio"!=type||getTracks(stream,"audio").forEach(function(track){track.enabled=!0,connection.streamEvents[stream.streamid].isAudioMuted=!1}),"undefined"!=typeof type&&"video"!=type||(getTracks(stream,"video").forEach(function(track){track.enabled=!0}),"undefined"!=typeof type&&"video"==type&&connection.streamEvents[stream.streamid].isAudioMuted&&!function looper(times){times||(times=0),times++,times<100&&connection.streamEvents[stream.streamid].isAudioMuted&&(stream.mute("audio"),setTimeout(function(){looper(times)},50))}()),"undefined"!=typeof syncAction&&1!=syncAction||StreamsHandler.onSyncNeeded(stream.streamid,"unmute",type),connection.streamEvents[stream.streamid].unmuteType=type||"both",fireEvent(stream,"unmute",type)}}}function afterEach(setTimeoutInteval,numberOfTimes,callback,startedTimes){startedTimes=(startedTimes||0)+1,startedTimes>=numberOfTimes||setTimeout(function(){callback(),afterEach(setTimeoutInteval,numberOfTimes,callback,startedTimes)},setTimeoutInteval)}return{setHandlers:setHandlers,onSyncNeeded:function(streamid,action,type){}}}();window.addEventListener("message",function(event){event.origin==window.location.origin&&onMessageCallback(event.data)});var sourceId,screenCallback,chromeMediaSource="screen",isFirefox="undefined"!=typeof window.InstallTrigger,isOpera=!!window.opera||navigator.userAgent.indexOf(" OPR/")>=0,TextSender=(!!window.chrome&&!isOpera,{send:function(config){function sendText(textMessage,text){var data={type:"text",uuid:uuid,sendingTime:sendingTime};textMessage&&(text=textMessage,data.packets=parseInt(text.length/packetSize)),text.length>packetSize?data.message=text.slice(0,packetSize):(data.message=text,data.last=!0,data.isobject=isobject),channel.send(data,remoteUserId),textToTransfer=text.slice(data.message.length),textToTransfer.length&&setTimeout(function(){sendText(null,textToTransfer)},connection.chunkInterval||100)}var connection=config.connection,channel=config.channel,remoteUserId=config.remoteUserId,initialText=config.text,packetSize=connection.chunkSize||1e3,textToTransfer="",isobject=!1;isString(initialText)||(isobject=!0,initialText=JSON.stringify(initialText));var uuid=getRandomString(),sendingTime=(new Date).getTime();sendText(initialText)}}),FileProgressBarHandler=function(){function handle(connection){function updateLabel(progress,label){if(progress.position!==-1){var position=+progress.position.toFixed(2).split(".")[1]||100;label.innerHTML=position+"%"}}var progressHelper={};connection.onFileStart=function(file){var div=document.createElement("div");return div.title=file.name,div.innerHTML="<label>0%</label> <progress></progress>",file.remoteUserId&&(div.innerHTML+=" (Sharing with:"+file.remoteUserId+")"),connection.filesContainer||(connection.filesContainer=document.body||document.documentElement),connection.filesContainer.insertBefore(div,connection.filesContainer.firstChild),file.remoteUserId?(progressHelper[file.uuid]||(progressHelper[file.uuid]={}),progressHelper[file.uuid][file.remoteUserId]={div:div,progress:div.querySelector("progress"),label:div.querySelector("label")},void(progressHelper[file.uuid][file.remoteUserId].progress.max=file.maxChunks)):(progressHelper[file.uuid]={div:div,progress:div.querySelector("progress"),label:div.querySelector("label")},void(progressHelper[file.uuid].progress.max=file.maxChunks))},connection.onFileProgress=function(chunk){var helper=progressHelper[chunk.uuid];helper&&(chunk.remoteUserId&&!(helper=progressHelper[chunk.uuid][chunk.remoteUserId])||(helper.progress.value=chunk.currentPosition||chunk.maxChunks||helper.progress.max,updateLabel(helper.progress,helper.label)))},connection.onFileEnd=function(file){var helper=progressHelper[file.uuid];if(!helper)return void console.error("No such progress-helper element exist.",file);if(!file.remoteUserId||(helper=progressHelper[file.uuid][file.remoteUserId])){var div=helper.div;file.type.indexOf("image")!=-1?div.innerHTML='<a href="'+file.url+'" download="'+file.name+'">Download <strong style="color:red;">'+file.name+'</strong> </a><br /><img src="'+file.url+'" title="'+file.name+'" style="max-width: 80%;">':div.innerHTML='<a href="'+file.url+'" download="'+file.name+'">Download <strong style="color:red;">'+file.name+'</strong> </a><br /><iframe src="'+file.url+'" title="'+file.name+'" style="width: 80%;border: 0;height: inherit;margin-top:1em;"></iframe>'}}}return{handle:handle}}(),TranslationHandler=function(){function handle(connection){connection.autoTranslateText=!1,connection.language="en",connection.googKey="AIzaSyCgB5hmFY74WYB-EoWkhr9cAGr6TiTHrEE",connection.Translator={TranslateText:function(text,callback){var newScript=document.createElement("script");newScript.type="text/javascript";var sourceText=encodeURIComponent(text),randomNumber="method"+connection.token();window[randomNumber]=function(response){return response.data&&response.data.translations[0]&&callback?void callback(response.data.translations[0].translatedText):response.error&&"Daily Limit Exceeded"===response.error.message?void console.error('Text translation failed. Error message: "Daily Limit Exceeded."'):response.error?void console.error(response.error.message):void console.error(response)};var source="https://www.googleapis.com/language/translate/v2?key="+connection.googKey+"&target="+(connection.language||"en-US")+"&callback=window."+randomNumber+"&q="+sourceText;newScript.src=source,document.getElementsByTagName("head")[0].appendChild(newScript)},getListOfLanguages:function(callback){var xhr=new XMLHttpRequest;xhr.onreadystatechange=function(){if(xhr.readyState==XMLHttpRequest.DONE){var response=JSON.parse(xhr.responseText);if(response&&response.data&&response.data.languages)return void callback(response.data.languages);if(response.error&&"Daily Limit Exceeded"===response.error.message)return void console.error('Text translation failed. Error message: "Daily Limit Exceeded."');if(response.error)return void console.error(response.error.message);console.error(response)}};var url="https://www.googleapis.com/language/translate/v2/languages?key="+connection.googKey+"&target=en";xhr.open("GET",url,!0),xhr.send(null)}}}return{handle:handle}}();!function(connection){function onUserLeft(remoteUserId){connection.deletePeer(remoteUserId)}function connectSocket(connectCallback){if(connection.socketAutoReConnect=!0,connection.socket)return void(connectCallback&&connectCallback(connection.socket));if("undefined"==typeof SocketConnection)if("undefined"!=typeof FirebaseConnection)window.SocketConnection=FirebaseConnection;else{if("undefined"==typeof PubNubConnection)throw"SocketConnection.js seems missed.";window.SocketConnection=PubNubConnection}new SocketConnection(connection,function(s){connectCallback&&connectCallback(connection.socket)})}function joinRoom(connectionDescription,cb){connection.socket.emit("join-room",{sessionid:connection.sessionid,session:connection.session,mediaConstraints:connection.mediaConstraints,sdpConstraints:connection.sdpConstraints,streams:getStreamInfoForAdmin(),extra:connection.extra,password:"undefined"!=typeof connection.password&&"object"!=typeof connection.password?connection.password:""},function(isRoomJoined,error){if(isRoomJoined===!0){if(connection.enableLogs&&console.log("isRoomJoined: ",isRoomJoined," roomid: ",connection.sessionid),connection.peers[connection.sessionid])return;mPeer.onNegotiationNeeded(connectionDescription)}isRoomJoined===!1&&connection.enableLogs&&console.warn("isRoomJoined: ",error," roomid: ",connection.sessionid),cb(isRoomJoined,connection.sessionid,error)})}function openRoom(callback){connection.enableLogs&&console.log("Sending open-room signal to socket.io"),connection.waitingForLocalMedia=!1,connection.socket.emit("open-room",{sessionid:connection.sessionid,session:connection.session,mediaConstraints:connection.mediaConstraints,sdpConstraints:connection.sdpConstraints,streams:getStreamInfoForAdmin(),extra:connection.extra,identifier:connection.publicRoomIdentifier,password:"undefined"!=typeof connection.password&&"object"!=typeof connection.password?connection.password:""},function(isRoomOpened,error){isRoomOpened===!0&&(connection.enableLogs&&console.log("isRoomOpened: ",isRoomOpened," roomid: ",connection.sessionid),callback(isRoomOpened,connection.sessionid)),isRoomOpened===!1&&(connection.enableLogs&&console.warn("isRoomOpened: ",error," roomid: ",connection.sessionid),callback(isRoomOpened,connection.sessionid,error))})}function getStreamInfoForAdmin(){try{return connection.streamEvents.selectAll("local").map(function(event){return{streamid:event.streamid,tracks:event.stream.getTracks().length}})}catch(e){return[]}}function beforeJoin(userPreferences,callback){if(connection.dontCaptureUserMedia||userPreferences.isDataOnly)return void callback();var localMediaConstraints={};userPreferences.localPeerSdpConstraints.OfferToReceiveAudio&&(localMediaConstraints.audio=connection.mediaConstraints.audio),userPreferences.localPeerSdpConstraints.OfferToReceiveVideo&&(localMediaConstraints.video=connection.mediaConstraints.video);var session=userPreferences.session||connection.session;return session.oneway&&"two-way"!==session.audio&&"two-way"!==session.video&&"two-way"!==session.screen?void callback():(session.oneway&&session.audio&&"two-way"===session.audio&&(session={audio:!0}),void((session.audio||session.video||session.screen)&&(session.screen?"Edge"===DetectRTC.browser.name?navigator.getDisplayMedia({video:!0,audio:isAudioPlusTab(connection)}).then(function(screen){screen.isScreen=!0,mPeer.onGettingLocalMedia(screen),!session.audio&&!session.video||isAudioPlusTab(connection)?callback(screen):connection.invokeGetUserMedia(null,callback)},function(error){console.error("Unable to capture screen on Edge. HTTPs and version 17+ is required.")}):connection.getScreenConstraints(function(error,screen_constraints){connection.invokeGetUserMedia({audio:!!isAudioPlusTab(connection)&&getAudioScreenConstraints(screen_constraints),video:screen_constraints,isScreen:!0},!session.audio&&!session.video||isAudioPlusTab(connection)?callback:connection.invokeGetUserMedia(null,callback))}):(session.audio||session.video)&&connection.invokeGetUserMedia(null,callback,session))))}function applyConstraints(stream,mediaConstraints){return stream?(mediaConstraints.audio&&getTracks(stream,"audio").forEach(function(track){track.applyConstraints(mediaConstraints.audio)}),void(mediaConstraints.video&&getTracks(stream,"video").forEach(function(track){track.applyConstraints(mediaConstraints.video)}))):void(connection.enableLogs&&console.error("No stream to applyConstraints."))}function replaceTrack(track,remoteUserId,isVideoTrack){return remoteUserId?void mPeer.replaceTrack(track,remoteUserId,isVideoTrack):void connection.peers.getAllParticipants().forEach(function(participant){mPeer.replaceTrack(track,participant,isVideoTrack)})}forceOptions=forceOptions||{useDefaultDevices:!0},connection.channel=connection.sessionid=(roomid||location.href.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g,"").split("\n").join("").split("\r").join(""))+"";var mPeer=new MultiPeers(connection),preventDuplicateOnStreamEvents={};mPeer.onGettingLocalMedia=function(stream,callback){if(callback=callback||function(){},preventDuplicateOnStreamEvents[stream.streamid])return void callback();preventDuplicateOnStreamEvents[stream.streamid]=!0;try{stream.type="local"}catch(e){}connection.setStreamEndHandler(stream),getRMCMediaElement(stream,function(mediaElement){mediaElement.id=stream.streamid,mediaElement.muted=!0,mediaElement.volume=0,connection.attachStreams.indexOf(stream)===-1&&connection.attachStreams.push(stream),"undefined"!=typeof StreamsHandler&&StreamsHandler.setHandlers(stream,!0,connection),connection.streamEvents[stream.streamid]={stream:stream,type:"local",mediaElement:mediaElement,userid:connection.userid,extra:connection.extra,streamid:stream.streamid,isAudioMuted:!0};try{setHarkEvents(connection,connection.streamEvents[stream.streamid]),setMuteHandlers(connection,connection.streamEvents[stream.streamid]),connection.onstream(connection.streamEvents[stream.streamid])}catch(e){}callback()},connection)},mPeer.onGettingRemoteMedia=function(stream,remoteUserId){try{stream.type="remote"}catch(e){}connection.setStreamEndHandler(stream,"remote-stream"),getRMCMediaElement(stream,function(mediaElement){mediaElement.id=stream.streamid,"undefined"!=typeof StreamsHandler&&StreamsHandler.setHandlers(stream,!1,connection),connection.streamEvents[stream.streamid]={stream:stream,type:"remote",userid:remoteUserId,extra:connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:{},mediaElement:mediaElement,streamid:stream.streamid},setMuteHandlers(connection,connection.streamEvents[stream.streamid]),connection.onstream(connection.streamEvents[stream.streamid])},connection)},mPeer.onRemovingRemoteMedia=function(stream,remoteUserId){var streamEvent=connection.streamEvents[stream.streamid];streamEvent||(streamEvent={stream:stream,type:"remote",userid:remoteUserId,extra:connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:{},streamid:stream.streamid,mediaElement:connection.streamEvents[stream.streamid]?connection.streamEvents[stream.streamid].mediaElement:null}),connection.peersBackup[streamEvent.userid]&&(streamEvent.extra=connection.peersBackup[streamEvent.userid].extra),connection.onstreamended(streamEvent),delete connection.streamEvents[stream.streamid]},mPeer.onNegotiationNeeded=function(message,remoteUserId,callback){callback=callback||function(){},remoteUserId=remoteUserId||message.remoteUserId,message=message||"";var messageToDeliver={remoteUserId:remoteUserId,message:message,sender:connection.userid};message.remoteUserId&&message.message&&message.sender&&(messageToDeliver=message),connectSocket(function(){connection.socket.emit(connection.socketMessageEvent,messageToDeliver,callback)})},mPeer.onUserLeft=onUserLeft,mPeer.disconnectWith=function(remoteUserId,callback){connection.socket&&connection.socket.emit("disconnect-with",remoteUserId,callback||function(){}),connection.deletePeer(remoteUserId)},connection.socketOptions={transport:"polling"},connection.openOrJoin=function(roomid,callback){callback=callback||function(){},connection.checkPresence(roomid,function(isRoomExist,roomid){if(isRoomExist){connection.sessionid=roomid;var localPeerSdpConstraints=!1,remotePeerSdpConstraints=!1,isOneWay=!!connection.session.oneway,isDataOnly=isData(connection.session);remotePeerSdpConstraints={OfferToReceiveAudio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.sdpConstraints.mandatory.OfferToReceiveVideo},localPeerSdpConstraints={OfferToReceiveAudio:isOneWay?!!connection.session.audio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:isOneWay?!!connection.session.video||!!connection.session.screen:connection.sdpConstraints.mandatory.OfferToReceiveVideo};var connectionDescription={remoteUserId:connection.sessionid,message:{newParticipationRequest:!0,isOneWay:isOneWay,isDataOnly:isDataOnly,localPeerSdpConstraints:localPeerSdpConstraints,remotePeerSdpConstraints:remotePeerSdpConstraints},sender:connection.userid};return void beforeJoin(connectionDescription.message,function(){joinRoom(connectionDescription,callback)})}return connection.waitingForLocalMedia=!0,connection.isInitiator=!0,connection.sessionid=roomid||connection.sessionid,isData(connection.session)?void openRoom(callback):void connection.captureUserMedia(function(){openRoom(callback)})})},connection.waitingForLocalMedia=!1,connection.open=function(roomid,callback){callback=callback||function(){},connection.waitingForLocalMedia=!0,connection.isInitiator=!0,connection.sessionid=roomid||connection.sessionid,connectSocket(function(){return isData(connection.session)?void openRoom(callback):void connection.captureUserMedia(function(){openRoom(callback)})})},connection.peersBackup={},connection.deletePeer=function(remoteUserId){if(remoteUserId&&connection.peers[remoteUserId]){var eventObject={userid:remoteUserId,extra:connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:{}};if(connection.peersBackup[eventObject.userid]&&(eventObject.extra=connection.peersBackup[eventObject.userid].extra),connection.onleave(eventObject),connection.peers[remoteUserId]){connection.peers[remoteUserId].streams.forEach(function(stream){stream.stop()});var peer=connection.peers[remoteUserId].peer;if(peer&&"closed"!==peer.iceConnectionState)try{peer.close()}catch(e){}connection.peers[remoteUserId]&&(connection.peers[remoteUserId].peer=null,delete connection.peers[remoteUserId])}}},connection.rejoin=function(connectionDescription){if(!connection.isInitiator&&connectionDescription&&Object.keys(connectionDescription).length){var extra={};connection.peers[connectionDescription.remoteUserId]&&(extra=connection.peers[connectionDescription.remoteUserId].extra,connection.deletePeer(connectionDescription.remoteUserId)),connectionDescription&&connectionDescription.remoteUserId&&(connection.join(connectionDescription.remoteUserId),connection.onReConnecting({userid:connectionDescription.remoteUserId,extra:extra}))}},connection.join=function(remoteUserId,options){connection.sessionid=!!remoteUserId&&(remoteUserId.sessionid||remoteUserId.remoteUserId||remoteUserId)||connection.sessionid,connection.sessionid+="";var localPeerSdpConstraints=!1,remotePeerSdpConstraints=!1,isOneWay=!1,isDataOnly=!1;if(remoteUserId&&remoteUserId.session||!remoteUserId||"string"==typeof remoteUserId){var session=remoteUserId?remoteUserId.session||connection.session:connection.session;isOneWay=!!session.oneway,isDataOnly=isData(session),remotePeerSdpConstraints={OfferToReceiveAudio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.sdpConstraints.mandatory.OfferToReceiveVideo},localPeerSdpConstraints={OfferToReceiveAudio:isOneWay?!!connection.session.audio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:isOneWay?!!connection.session.video||!!connection.session.screen:connection.sdpConstraints.mandatory.OfferToReceiveVideo}}options=options||{};var cb=function(){};"function"==typeof options&&(cb=options,options={}),"undefined"!=typeof options.localPeerSdpConstraints&&(localPeerSdpConstraints=options.localPeerSdpConstraints),
"undefined"!=typeof options.remotePeerSdpConstraints&&(remotePeerSdpConstraints=options.remotePeerSdpConstraints),"undefined"!=typeof options.isOneWay&&(isOneWay=options.isOneWay),"undefined"!=typeof options.isDataOnly&&(isDataOnly=options.isDataOnly);var connectionDescription={remoteUserId:connection.sessionid,message:{newParticipationRequest:!0,isOneWay:isOneWay,isDataOnly:isDataOnly,localPeerSdpConstraints:localPeerSdpConstraints,remotePeerSdpConstraints:remotePeerSdpConstraints},sender:connection.userid};return beforeJoin(connectionDescription.message,function(){connectSocket(function(){joinRoom(connectionDescription,cb)})}),connectionDescription},connection.publicRoomIdentifier="",connection.getUserMedia=connection.captureUserMedia=function(callback,sessionForced){callback=callback||function(){};var session=sessionForced||connection.session;return connection.dontCaptureUserMedia||isData(session)?void callback():void((session.audio||session.video||session.screen)&&(session.screen?"Edge"===DetectRTC.browser.name?navigator.getDisplayMedia({video:!0,audio:isAudioPlusTab(connection)}).then(function(screen){if(screen.isScreen=!0,mPeer.onGettingLocalMedia(screen),(session.audio||session.video)&&!isAudioPlusTab(connection)){var nonScreenSession={};for(var s in session)"screen"!==s&&(nonScreenSession[s]=session[s]);return void connection.invokeGetUserMedia(sessionForced,callback,nonScreenSession)}callback(screen)},function(error){console.error("Unable to capture screen on Edge. HTTPs and version 17+ is required.")}):connection.getScreenConstraints(function(error,screen_constraints){if(error)throw error;connection.invokeGetUserMedia({audio:!!isAudioPlusTab(connection)&&getAudioScreenConstraints(screen_constraints),video:screen_constraints,isScreen:!0},function(stream){if((session.audio||session.video)&&!isAudioPlusTab(connection)){var nonScreenSession={};for(var s in session)"screen"!==s&&(nonScreenSession[s]=session[s]);return void connection.invokeGetUserMedia(sessionForced,callback,nonScreenSession)}callback(stream)})}):(session.audio||session.video)&&connection.invokeGetUserMedia(sessionForced,callback,session)))},connection.onbeforeunload=function(arg1,dontCloseSocket){connection.closeBeforeUnload&&(connection.peers.getAllParticipants().forEach(function(participant){mPeer.onNegotiationNeeded({userLeft:!0},participant),connection.peers[participant]&&connection.peers[participant].peer&&connection.peers[participant].peer.close(),delete connection.peers[participant]}),dontCloseSocket||connection.closeSocket(),connection.isInitiator=!1)},window.ignoreBeforeUnload?connection.closeBeforeUnload=!1:(connection.closeBeforeUnload=!0,window.addEventListener("beforeunload",connection.onbeforeunload,!1)),connection.userid=getRandomString(),connection.changeUserId=function(newUserId,callback){callback=callback||function(){},connection.userid=newUserId||getRandomString(),connection.socket.emit("changed-uuid",connection.userid,callback)},connection.extra={},connection.attachStreams=[],connection.session={audio:!0,video:!0},connection.enableFileSharing=!1,connection.bandwidth={screen:!1,audio:!1,video:!1},connection.codecs={audio:"opus",video:"VP9"},connection.processSdp=function(sdp){return isUnifiedPlanSupportedDefault()?sdp:"Safari"===DetectRTC.browser.name?sdp:("VP8"===connection.codecs.video.toUpperCase()&&(sdp=CodecsHandler.preferCodec(sdp,"vp8")),"VP9"===connection.codecs.video.toUpperCase()&&(sdp=CodecsHandler.preferCodec(sdp,"vp9")),"H264"===connection.codecs.video.toUpperCase()&&(sdp=CodecsHandler.preferCodec(sdp,"h264")),"G722"===connection.codecs.audio&&(sdp=CodecsHandler.removeNonG722(sdp)),"Firefox"===DetectRTC.browser.name?sdp:((connection.bandwidth.video||connection.bandwidth.screen)&&(sdp=CodecsHandler.setApplicationSpecificBandwidth(sdp,connection.bandwidth,!!connection.session.screen)),connection.bandwidth.video&&(sdp=CodecsHandler.setVideoBitrates(sdp,{min:8*connection.bandwidth.video*1024,max:8*connection.bandwidth.video*1024})),connection.bandwidth.audio&&(sdp=CodecsHandler.setOpusAttributes(sdp,{maxaveragebitrate:8*connection.bandwidth.audio*1024,maxplaybackrate:8*connection.bandwidth.audio*1024,stereo:1,maxptime:3})),sdp))},"undefined"!=typeof CodecsHandler&&(connection.BandwidthHandler=connection.CodecsHandler=CodecsHandler),connection.mediaConstraints={audio:{mandatory:{},optional:connection.bandwidth.audio?[{bandwidth:8*connection.bandwidth.audio*1024||1048576}]:[]},video:{mandatory:{},optional:connection.bandwidth.video?[{bandwidth:8*connection.bandwidth.video*1024||1048576},{facingMode:"user"}]:[{facingMode:"user"}]}},"Firefox"===DetectRTC.browser.name&&(connection.mediaConstraints={audio:!0,video:!0}),forceOptions.useDefaultDevices||DetectRTC.isMobileDevice||DetectRTC.load(function(){var lastAudioDevice,lastVideoDevice;if(DetectRTC.MediaDevices.forEach(function(device){"audioinput"===device.kind&&connection.mediaConstraints.audio!==!1&&(lastAudioDevice=device),"videoinput"===device.kind&&connection.mediaConstraints.video!==!1&&(lastVideoDevice=device)}),lastAudioDevice){if("Firefox"===DetectRTC.browser.name)return void(connection.mediaConstraints.audio!==!0?connection.mediaConstraints.audio.deviceId=lastAudioDevice.id:connection.mediaConstraints.audio={deviceId:lastAudioDevice.id});1==connection.mediaConstraints.audio&&(connection.mediaConstraints.audio={mandatory:{},optional:[]}),connection.mediaConstraints.audio.optional||(connection.mediaConstraints.audio.optional=[]);var optional=[{sourceId:lastAudioDevice.id}];connection.mediaConstraints.audio.optional=optional.concat(connection.mediaConstraints.audio.optional)}if(lastVideoDevice){if("Firefox"===DetectRTC.browser.name)return void(connection.mediaConstraints.video!==!0?connection.mediaConstraints.video.deviceId=lastVideoDevice.id:connection.mediaConstraints.video={deviceId:lastVideoDevice.id});1==connection.mediaConstraints.video&&(connection.mediaConstraints.video={mandatory:{},optional:[]}),connection.mediaConstraints.video.optional||(connection.mediaConstraints.video.optional=[]);var optional=[{sourceId:lastVideoDevice.id}];connection.mediaConstraints.video.optional=optional.concat(connection.mediaConstraints.video.optional)}}),connection.sdpConstraints={mandatory:{OfferToReceiveAudio:!0,OfferToReceiveVideo:!0},optional:[{VoiceActivityDetection:!1}]},connection.sdpSemantics=null,connection.iceCandidatePoolSize=null,connection.bundlePolicy=null,connection.rtcpMuxPolicy=null,connection.iceTransportPolicy=null,connection.optionalArgument={optional:[{DtlsSrtpKeyAgreement:!0},{googImprovedWifiBwe:!0},{googScreencastMinBitrate:300},{googIPv6:!0},{googDscp:!0},{googCpuUnderuseThreshold:55},{googCpuOveruseThreshold:85},{googSuspendBelowMinBitrate:!0},{googCpuOveruseDetection:!0}],mandatory:{}},connection.iceServers=IceServersHandler.getIceServers(connection),connection.candidates={host:!0,stun:!0,turn:!0},connection.iceProtocols={tcp:!0,udp:!0},connection.onopen=function(event){connection.enableLogs&&console.info("Data connection has been opened between you & ",event.userid)},connection.onclose=function(event){connection.enableLogs&&console.warn("Data connection has been closed between you & ",event.userid)},connection.onerror=function(error){connection.enableLogs&&console.error(error.userid,"data-error",error)},connection.onmessage=function(event){connection.enableLogs&&console.debug("data-message",event.userid,event.data)},connection.send=function(data,remoteUserId){connection.peers.send(data,remoteUserId)},connection.close=connection.disconnect=connection.leave=function(){connection.onbeforeunload(!1,!0)},connection.closeEntireSession=function(callback){callback=callback||function(){},connection.socket.emit("close-entire-session",function looper(){return connection.getAllParticipants().length?void setTimeout(looper,100):(connection.onEntireSessionClosed({sessionid:connection.sessionid,userid:connection.userid,extra:connection.extra}),void connection.changeUserId(null,function(){connection.close(),callback()}))})},connection.onEntireSessionClosed=function(event){connection.enableLogs&&console.info("Entire session is closed: ",event.sessionid,event.extra)},connection.onstream=function(e){var parentNode=connection.videosContainer;parentNode.insertBefore(e.mediaElement,parentNode.firstChild);var played=e.mediaElement.play();return"undefined"!=typeof played?void played["catch"](function(){}).then(function(){setTimeout(function(){e.mediaElement.play()},2e3)}):void setTimeout(function(){e.mediaElement.play()},2e3)},connection.onstreamended=function(e){e.mediaElement||(e.mediaElement=document.getElementById(e.streamid)),e.mediaElement&&e.mediaElement.parentNode&&e.mediaElement.parentNode.removeChild(e.mediaElement)},connection.direction="many-to-many",connection.removeStream=function(streamid,remoteUserId){var stream;return connection.attachStreams.forEach(function(localStream){localStream.id===streamid&&(stream=localStream)}),stream?(connection.peers.getAllParticipants().forEach(function(participant){if(!remoteUserId||participant===remoteUserId){var user=connection.peers[participant];try{user.peer.removeStream(stream)}catch(e){}}}),void connection.renegotiate()):void console.warn("No such stream exist.",streamid)},connection.addStream=function(session,remoteUserId){function gumCallback(stream){session.streamCallback&&session.streamCallback(stream),connection.renegotiate(remoteUserId)}return session.getTracks?(connection.attachStreams.indexOf(session)===-1&&(session.streamid||(session.streamid=session.id),connection.attachStreams.push(session)),void connection.renegotiate(remoteUserId)):isData(session)?void connection.renegotiate(remoteUserId):void((session.audio||session.video||session.screen)&&(session.screen?"Edge"===DetectRTC.browser.name?navigator.getDisplayMedia({video:!0,audio:isAudioPlusTab(connection)}).then(function(screen){screen.isScreen=!0,mPeer.onGettingLocalMedia(screen),!session.audio&&!session.video||isAudioPlusTab(connection)?gumCallback(screen):connection.invokeGetUserMedia(null,function(stream){gumCallback(stream)})},function(error){console.error("Unable to capture screen on Edge. HTTPs and version 17+ is required.")}):connection.getScreenConstraints(function(error,screen_constraints){return error?"PermissionDeniedError"===error?(session.streamCallback&&session.streamCallback(null),void(connection.enableLogs&&console.error("User rejected to share his screen."))):alert(error):void connection.invokeGetUserMedia({audio:!!isAudioPlusTab(connection)&&getAudioScreenConstraints(screen_constraints),video:screen_constraints,isScreen:!0},function(stream){!session.audio&&!session.video||isAudioPlusTab(connection)?gumCallback(stream):connection.invokeGetUserMedia(null,function(stream){gumCallback(stream)})})}):(session.audio||session.video)&&connection.invokeGetUserMedia(null,gumCallback)))},connection.invokeGetUserMedia=function(localMediaConstraints,callback,session){session||(session=connection.session),localMediaConstraints||(localMediaConstraints=connection.mediaConstraints),getUserMediaHandler({onGettingLocalMedia:function(stream){var videoConstraints=localMediaConstraints.video;videoConstraints&&(videoConstraints.mediaSource||videoConstraints.mozMediaSource?stream.isScreen=!0:videoConstraints.mandatory&&videoConstraints.mandatory.chromeMediaSource&&(stream.isScreen=!0)),stream.isScreen||(stream.isVideo=!!getTracks(stream,"video").length,stream.isAudio=!stream.isVideo&&getTracks(stream,"audio").length),mPeer.onGettingLocalMedia(stream,function(){"function"==typeof callback&&callback(stream)})},onLocalMediaError:function(error,constraints){mPeer.onLocalMediaError(error,constraints)},localMediaConstraints:localMediaConstraints||{audio:!!session.audio&&localMediaConstraints.audio,video:!!session.video&&localMediaConstraints.video}})},connection.applyConstraints=function(mediaConstraints,streamid){if(!MediaStreamTrack||!MediaStreamTrack.prototype.applyConstraints)return void alert("track.applyConstraints is NOT supported in your browser.");if(streamid){var stream;return connection.streamEvents[streamid]&&(stream=connection.streamEvents[streamid].stream),void applyConstraints(stream,mediaConstraints)}connection.attachStreams.forEach(function(stream){applyConstraints(stream,mediaConstraints)})},connection.replaceTrack=function(session,remoteUserId,isVideoTrack){function gumCallback(stream){connection.replaceTrack(stream,remoteUserId,isVideoTrack||session.video||session.screen)}if(session=session||{},!RTCPeerConnection.prototype.getSenders)return void connection.addStream(session);if(session instanceof MediaStreamTrack)return void replaceTrack(session,remoteUserId,isVideoTrack);if(session instanceof MediaStream)return getTracks(session,"video").length&&replaceTrack(getTracks(session,"video")[0],remoteUserId,!0),void(getTracks(session,"audio").length&&replaceTrack(getTracks(session,"audio")[0],remoteUserId,!1));if(isData(session))throw"connection.replaceTrack requires audio and/or video and/or screen.";(session.audio||session.video||session.screen)&&(session.screen?"Edge"===DetectRTC.browser.name?navigator.getDisplayMedia({video:!0,audio:isAudioPlusTab(connection)}).then(function(screen){screen.isScreen=!0,mPeer.onGettingLocalMedia(screen),!session.audio&&!session.video||isAudioPlusTab(connection)?gumCallback(screen):connection.invokeGetUserMedia(null,gumCallback)},function(error){console.error("Unable to capture screen on Edge. HTTPs and version 17+ is required.")}):connection.getScreenConstraints(function(error,screen_constraints){return error?alert(error):void connection.invokeGetUserMedia({audio:!!isAudioPlusTab(connection)&&getAudioScreenConstraints(screen_constraints),video:screen_constraints,isScreen:!0},!session.audio&&!session.video||isAudioPlusTab(connection)?gumCallback:connection.invokeGetUserMedia(null,gumCallback))}):(session.audio||session.video)&&connection.invokeGetUserMedia(null,gumCallback))},connection.resetTrack=function(remoteUsersIds,isVideoTrack){remoteUsersIds||(remoteUsersIds=connection.getAllParticipants()),"string"==typeof remoteUsersIds&&(remoteUsersIds=[remoteUsersIds]),remoteUsersIds.forEach(function(participant){var peer=connection.peers[participant].peer;"undefined"!=typeof isVideoTrack&&isVideoTrack!==!0||!peer.lastVideoTrack||connection.replaceTrack(peer.lastVideoTrack,participant,!0),"undefined"!=typeof isVideoTrack&&isVideoTrack!==!1||!peer.lastAudioTrack||connection.replaceTrack(peer.lastAudioTrack,participant,!1)})},connection.renegotiate=function(remoteUserId){return remoteUserId?void mPeer.renegotiatePeer(remoteUserId):void connection.peers.getAllParticipants().forEach(function(participant){mPeer.renegotiatePeer(participant)})},connection.setStreamEndHandler=function(stream,isRemote){if(stream&&stream.addEventListener&&(isRemote=!!isRemote,!stream.alreadySetEndHandler)){stream.alreadySetEndHandler=!0;var streamEndedEvent="ended";"oninactive"in stream&&(streamEndedEvent="inactive"),stream.addEventListener(streamEndedEvent,function(){if(stream.idInstance&&currentUserMediaRequest.remove(stream.idInstance),!isRemote){var streams=[];connection.attachStreams.forEach(function(s){s.id!=stream.id&&streams.push(s)}),connection.attachStreams=streams}var streamEvent=connection.streamEvents[stream.streamid];if(streamEvent||(streamEvent={stream:stream,streamid:stream.streamid,type:isRemote?"remote":"local",userid:connection.userid,extra:connection.extra,mediaElement:connection.streamEvents[stream.streamid]?connection.streamEvents[stream.streamid].mediaElement:null}),isRemote&&connection.peers[streamEvent.userid]){var peer=connection.peers[streamEvent.userid].peer,streams=[];peer.getRemoteStreams().forEach(function(s){s.id!=stream.id&&streams.push(s)}),connection.peers[streamEvent.userid].streams=streams}streamEvent.userid===connection.userid&&"remote"===streamEvent.type||(connection.peersBackup[streamEvent.userid]&&(streamEvent.extra=connection.peersBackup[streamEvent.userid].extra),connection.onstreamended(streamEvent),delete connection.streamEvents[stream.streamid])},!1)}},connection.onMediaError=function(error,constraints){connection.enableLogs&&console.error(error,constraints)},connection.autoCloseEntireSession=!1,connection.filesContainer=connection.videosContainer=document.body||document.documentElement,connection.isInitiator=!1,connection.shareFile=mPeer.shareFile,"undefined"!=typeof FileProgressBarHandler&&FileProgressBarHandler.handle(connection),"undefined"!=typeof TranslationHandler&&TranslationHandler.handle(connection),connection.token=getRandomString,connection.onNewParticipant=function(participantId,userPreferences){connection.acceptParticipationRequest(participantId,userPreferences)},connection.acceptParticipationRequest=function(participantId,userPreferences){userPreferences.successCallback&&(userPreferences.successCallback(),delete userPreferences.successCallback),mPeer.createNewPeer(participantId,userPreferences)},"undefined"!=typeof StreamsHandler&&(connection.StreamsHandler=StreamsHandler),connection.onleave=function(userid){},connection.invokeSelectFileDialog=function(callback){var selector=new FileSelector;selector.accept="*.*",selector.selectSingleFile(callback)},connection.onmute=function(e){if(e&&e.mediaElement)if("both"===e.muteType||"video"===e.muteType){e.mediaElement.src=null;var paused=e.mediaElement.pause();"undefined"!=typeof paused?paused.then(function(){e.mediaElement.poster=e.snapshot||"https://cdn.webrtc-experiment.com/images/muted.png"}):e.mediaElement.poster=e.snapshot||"https://cdn.webrtc-experiment.com/images/muted.png"}else"audio"===e.muteType&&(e.mediaElement.muted=!0)},connection.onunmute=function(e){e&&e.mediaElement&&e.stream&&("both"===e.unmuteType||"video"===e.unmuteType?(e.mediaElement.poster=null,e.mediaElement.srcObject=e.stream,e.mediaElement.play()):"audio"===e.unmuteType&&(e.mediaElement.muted=!1))},connection.onExtraDataUpdated=function(event){event.status="online",connection.onUserStatusChanged(event,!0)},connection.getAllParticipants=function(sender){return connection.peers.getAllParticipants(sender)},"undefined"!=typeof StreamsHandler&&(StreamsHandler.onSyncNeeded=function(streamid,action,type){connection.peers.getAllParticipants().forEach(function(participant){mPeer.onNegotiationNeeded({streamid:streamid,action:action,streamSyncNeeded:!0,type:type||"both"},participant)})}),connection.connectSocket=function(callback){connectSocket(callback)},connection.closeSocket=function(){try{io.sockets={}}catch(e){}connection.socket&&("function"==typeof connection.socket.disconnect&&connection.socket.disconnect(),"function"==typeof connection.socket.resetProps&&connection.socket.resetProps(),connection.socket=null)},connection.getSocket=function(callback){return!callback&&connection.enableLogs&&console.warn("getSocket.callback paramter is required."),callback=callback||function(){},connection.socket?callback(connection.socket):connectSocket(function(){callback(connection.socket)}),connection.socket},connection.getRemoteStreams=mPeer.getRemoteStreams;var skipStreams=["selectFirst","selectAll","forEach"];if(connection.streamEvents={selectFirst:function(options){return connection.streamEvents.selectAll(options)[0]},selectAll:function(options){options||(options={local:!0,remote:!0,isScreen:!0,isAudio:!0,isVideo:!0}),"local"==options&&(options={local:!0}),"remote"==options&&(options={remote:!0}),"screen"==options&&(options={isScreen:!0}),"audio"==options&&(options={isAudio:!0}),"video"==options&&(options={isVideo:!0});var streams=[];return Object.keys(connection.streamEvents).forEach(function(key){var event=connection.streamEvents[key];if(skipStreams.indexOf(key)===-1){var ignore=!0;options.local&&"local"===event.type&&(ignore=!1),options.remote&&"remote"===event.type&&(ignore=!1),options.isScreen&&event.stream.isScreen&&(ignore=!1),options.isVideo&&event.stream.isVideo&&(ignore=!1),options.isAudio&&event.stream.isAudio&&(ignore=!1),options.userid&&event.userid===options.userid&&(ignore=!1),ignore===!1&&streams.push(event)}}),streams}},connection.socketURL="/",connection.socketMessageEvent="RTCMultiConnection-Message",connection.socketCustomEvent="RTCMultiConnection-Custom-Message",connection.DetectRTC=DetectRTC,connection.setCustomSocketEvent=function(customEvent){customEvent&&(connection.socketCustomEvent=customEvent),connection.socket&&connection.socket.emit("set-custom-socket-event-listener",connection.socketCustomEvent)},connection.getNumberOfBroadcastViewers=function(broadcastId,callback){connection.socket&&broadcastId&&callback&&connection.socket.emit("get-number-of-users-in-specific-broadcast",broadcastId,callback)},connection.onNumberOfBroadcastViewersUpdated=function(event){connection.enableLogs&&connection.isInitiator&&console.info("Number of broadcast (",event.broadcastId,") viewers",event.numberOfBroadcastViewers)},connection.onUserStatusChanged=function(event,dontWriteLogs){connection.enableLogs&&!dontWriteLogs&&console.info(event.userid,event.status)},connection.getUserMediaHandler=getUserMediaHandler,connection.multiPeersHandler=mPeer,connection.enableLogs=!0,connection.setCustomSocketHandler=function(customSocketHandler){"undefined"!=typeof SocketConnection&&(SocketConnection=customSocketHandler)},connection.chunkSize=4e4,connection.maxParticipantsAllowed=1e3,connection.disconnectWith=mPeer.disconnectWith,connection.checkPresence=function(roomid,callback){return roomid=roomid||connection.sessionid,"SSEConnection"===SocketConnection.name?void SSEConnection.checkPresence(roomid,function(isRoomExist,_roomid,extra){return connection.socket?void callback(isRoomExist,_roomid):(isRoomExist||(connection.userid=_roomid),void connection.connectSocket(function(){callback(isRoomExist,_roomid,extra)}))}):connection.socket?void connection.socket.emit("check-presence",roomid+"",function(isRoomExist,_roomid,extra){connection.enableLogs&&console.log("checkPresence.isRoomExist: ",isRoomExist," roomid: ",_roomid),callback(isRoomExist,_roomid,extra)}):void connection.connectSocket(function(){connection.checkPresence(roomid,callback)})},connection.onReadyForOffer=function(remoteUserId,userPreferences){connection.multiPeersHandler.createNewPeer(remoteUserId,userPreferences)},connection.setUserPreferences=function(userPreferences){return connection.dontAttachStream&&(userPreferences.dontAttachLocalStream=!0),connection.dontGetRemoteStream&&(userPreferences.dontGetRemoteStream=!0),userPreferences},connection.updateExtraData=function(){connection.socket.emit("extra-data-updated",connection.extra)},connection.enableScalableBroadcast=!1,connection.maxRelayLimitPerUser=3,connection.dontCaptureUserMedia=!1,connection.dontAttachStream=!1,connection.dontGetRemoteStream=!1,connection.onReConnecting=function(event){connection.enableLogs&&console.info("ReConnecting with",event.userid,"...")},connection.beforeAddingStream=function(stream){return stream},connection.beforeRemovingStream=function(stream){return stream},"undefined"!=typeof isChromeExtensionAvailable&&(connection.checkIfChromeExtensionAvailable=isChromeExtensionAvailable),"undefined"!=typeof isFirefoxExtensionAvailable&&(connection.checkIfChromeExtensionAvailable=isFirefoxExtensionAvailable),"undefined"!=typeof getChromeExtensionStatus&&(connection.getChromeExtensionStatus=getChromeExtensionStatus),connection.getScreenConstraints=function(callback,audioPlusTab){isAudioPlusTab(connection,audioPlusTab)&&(audioPlusTab=!0),getScreenConstraints(function(error,screen_constraints){error||(screen_constraints=connection.modifyScreenConstraints(screen_constraints),callback(error,screen_constraints))},audioPlusTab)},connection.modifyScreenConstraints=function(screen_constraints){return screen_constraints},connection.onPeerStateChanged=function(state){connection.enableLogs&&state.iceConnectionState.search(/closed|failed/gi)!==-1&&console.error("Peer connection is closed between you & ",state.userid,state.extra,"state:",state.iceConnectionState)},connection.isOnline=!0,listenEventHandler("online",function(){connection.isOnline=!0}),listenEventHandler("offline",function(){connection.isOnline=!1}),connection.isLowBandwidth=!1,navigator&&navigator.connection&&navigator.connection.type&&(connection.isLowBandwidth=navigator.connection.type.toString().toLowerCase().search(/wifi|cell/g)!==-1,connection.isLowBandwidth)){if(connection.bandwidth={audio:!1,video:!1,screen:!1},connection.mediaConstraints.audio&&connection.mediaConstraints.audio.optional&&connection.mediaConstraints.audio.optional.length){var newArray=[];connection.mediaConstraints.audio.optional.forEach(function(opt){"undefined"==typeof opt.bandwidth&&newArray.push(opt)}),connection.mediaConstraints.audio.optional=newArray}if(connection.mediaConstraints.video&&connection.mediaConstraints.video.optional&&connection.mediaConstraints.video.optional.length){var newArray=[];connection.mediaConstraints.video.optional.forEach(function(opt){"undefined"==typeof opt.bandwidth&&newArray.push(opt)}),connection.mediaConstraints.video.optional=newArray}}connection.getExtraData=function(remoteUserId,callback){if(!remoteUserId)throw"remoteUserId is required.";return"function"==typeof callback?void connection.socket.emit("get-remote-user-extra-data",remoteUserId,function(extra,remoteUserId,error){callback(extra,remoteUserId,error)}):connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:connection.peersBackup[remoteUserId]?connection.peersBackup[remoteUserId].extra:{}},forceOptions.autoOpenOrJoin&&connection.openOrJoin(connection.sessionid),connection.onUserIdAlreadyTaken=function(useridAlreadyTaken,yourNewUserId){connection.close(),connection.closeSocket(),connection.isInitiator=!1,connection.userid=connection.token(),connection.join(connection.sessionid),connection.enableLogs&&console.warn("Userid already taken.",useridAlreadyTaken,"Your new userid:",connection.userid)},connection.trickleIce=!0,connection.version="3.6.8",connection.onSettingLocalDescription=function(event){connection.enableLogs&&console.info("Set local description for remote user",event.userid)},connection.resetScreen=function(){sourceId=null,DetectRTC&&DetectRTC.screen&&delete DetectRTC.screen.sourceId,currentUserMediaRequest={streams:[],mutex:!1,queueRequests:[]}},connection.autoCreateMediaElement=!0,connection.password=null,connection.setPassword=function(password,callback){callback=callback||function(){},connection.socket?connection.socket.emit("set-password",password,callback):(connection.password=password,callback(!0,connection.sessionid,null))},connection.onSocketDisconnect=function(event){connection.enableLogs&&console.warn("socket.io connection is closed")},connection.onSocketError=function(event){connection.enableLogs&&console.warn("socket.io connection is failed")},connection.errors={ROOM_NOT_AVAILABLE:"Room not available",INVALID_PASSWORD:"Invalid password",USERID_NOT_AVAILABLE:"User ID does not exist",ROOM_PERMISSION_DENIED:"Room permission denied",ROOM_FULL:"Room full",DID_NOT_JOIN_ANY_ROOM:"Did not join any room yet",INVALID_SOCKET:"Invalid socket",PUBLIC_IDENTIFIER_MISSING:"publicRoomIdentifier is required",INVALID_ADMIN_CREDENTIAL:"Invalid username or password attempted"}}(this)};"undefined"!=typeof module&&(module.exports=exports=RTCMultiConnection),"function"==typeof define&&define.amd&&define("RTCMultiConnection",[],function(){return RTCMultiConnection});


'use strict';

// Last time updated: 2019-02-06 11:32:40 AM UTC

// ________________
// RecordRTC v5.5.4

// Open-Sourced: https://github.com/muaz-khan/RecordRTC

// --------------------------------------------------
// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
// --------------------------------------------------

// ____________
// RecordRTC.js

/**
 * {@link https://github.com/muaz-khan/RecordRTC|RecordRTC} is a WebRTC JavaScript library for audio/video as well as screen activity recording. It supports Chrome, Firefox, Opera, Android, and Microsoft Edge. Platforms: Linux, Mac and Windows. 
 * @summary Record audio, video or screen inside the browser.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef RecordRTC
 * @class
 * @example
 * var recorder = RecordRTC(mediaStream or [arrayOfMediaStream], {
 *     type: 'video', // audio or video or gif or canvas
 *     recorderType: MediaStreamRecorder || CanvasRecorder || StereoAudioRecorder || Etc
 * });
 * recorder.startRecording();
 * @see For further information:
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - Single media-stream object, array of media-streams, html-canvas-element, etc.
 * @param {object} config - {type:"video", recorderType: MediaStreamRecorder, disableLogs: true, numberOfAudioChannels: 1, bufferSize: 0, sampleRate: 0, desiredSampRate: 16000, video: HTMLVideoElement, etc.}
 */

function RecordRTC(mediaStream, config) {
    if (!mediaStream) {
        throw 'First parameter is required.';
    }

    config = config || {
        type: 'video'
    };

    config = new RecordRTCConfiguration(mediaStream, config);

    // a reference to user's recordRTC object
    var self = this;

    function startRecording(config2) {
        if (!!config2) {
            // allow users to set options using startRecording method
            // config2 is similar to main "config" object (second parameter over RecordRTC constructor)
            config = new RecordRTCConfiguration(mediaStream, config2);
        }

        if (!config.disableLogs) {
            console.log('started recording ' + config.type + ' stream.');
        }

        if (mediaRecorder) {
            mediaRecorder.clearRecordedData();
            mediaRecorder.record();

            setState('recording');

            if (self.recordingDuration) {
                handleRecordingDuration();
            }
            return self;
        }

        initRecorder(function() {
            if (self.recordingDuration) {
                handleRecordingDuration();
            }
        });

        return self;
    }

    function initRecorder(initCallback) {
        if (initCallback) {
            config.initCallback = function() {
                initCallback();
                initCallback = config.initCallback = null; // recorder.initRecorder should be call-backed once.
            };
        }

        var Recorder = new GetRecorderType(mediaStream, config);

        mediaRecorder = new Recorder(mediaStream, config);
        mediaRecorder.record();

        setState('recording');

        if (!config.disableLogs) {
            console.log('Initialized recorderType:', mediaRecorder.constructor.name, 'for output-type:', config.type);
        }
    }

    function stopRecording(callback) {
        callback = callback || function() {};

        if (!mediaRecorder) {
            warningLog();
            return;
        }

        if (self.state === 'paused') {
            self.resumeRecording();

            setTimeout(function() {
                stopRecording(callback);
            }, 1);
            return;
        }

        if (self.state !== 'recording' && !config.disableLogs) {
            console.warn('Recording state should be: "recording", however current state is: ', self.state);
        }

        if (!config.disableLogs) {
            console.log('Stopped recording ' + config.type + ' stream.');
        }

        if (config.type !== 'gif') {
            mediaRecorder.stop(_callback);
        } else {
            mediaRecorder.stop();
            _callback();
        }

        setState('stopped');

        function _callback(__blob) {
            if (!mediaRecorder) {
                if (typeof callback.call === 'function') {
                    callback.call(self, '');
                } else {
                    callback('');
                }
                return;
            }

            Object.keys(mediaRecorder).forEach(function(key) {
                if (typeof mediaRecorder[key] === 'function') {
                    return;
                }

                self[key] = mediaRecorder[key];
            });

            var blob = mediaRecorder.blob;

            if (!blob) {
                if (__blob) {
                    mediaRecorder.blob = blob = __blob;
                } else {
                    throw 'Recording failed.';
                }
            }

            if (blob && !config.disableLogs) {
                console.log(blob.type, '->', bytesToSize(blob.size));
            }

            if (callback) {
                var url;

                try {
                    url = URL.createObjectURL(blob);
                } catch (e) {}

                if (typeof callback.call === 'function') {
                    callback.call(self, url);
                } else {
                    callback(url);
                }
            }

            if (!config.autoWriteToDisk) {
                return;
            }

            getDataURL(function(dataURL) {
                var parameter = {};
                parameter[config.type + 'Blob'] = dataURL;
                DiskStorage.Store(parameter);
            });
        }
    }

    function pauseRecording() {
        if (!mediaRecorder) {
            warningLog();
            return;
        }

        if (self.state !== 'recording') {
            if (!config.disableLogs) {
                console.warn('Unable to pause the recording. Recording state: ', self.state);
            }
            return;
        }

        setState('paused');

        mediaRecorder.pause();

        if (!config.disableLogs) {
            console.log('Paused recording.');
        }
    }

    function resumeRecording() {
        if (!mediaRecorder) {
            warningLog();
            return;
        }

        if (self.state !== 'paused') {
            if (!config.disableLogs) {
                console.warn('Unable to resume the recording. Recording state: ', self.state);
            }
            return;
        }

        setState('recording');

        // not all libs have this method yet
        mediaRecorder.resume();

        if (!config.disableLogs) {
            console.log('Resumed recording.');
        }
    }

    function readFile(_blob) {
        postMessage(new FileReaderSync().readAsDataURL(_blob));
    }

    function getDataURL(callback, _mediaRecorder) {
        if (!callback) {
            throw 'Pass a callback function over getDataURL.';
        }

        var blob = _mediaRecorder ? _mediaRecorder.blob : (mediaRecorder || {}).blob;

        if (!blob) {
            if (!config.disableLogs) {
                console.warn('Blob encoder did not finish its job yet.');
            }

            setTimeout(function() {
                getDataURL(callback, _mediaRecorder);
            }, 1000);
            return;
        }

        if (typeof Worker !== 'undefined' && !navigator.mozGetUserMedia) {
            var webWorker = processInWebWorker(readFile);

            webWorker.onmessage = function(event) {
                callback(event.data);
            };

            webWorker.postMessage(blob);
        } else {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function(event) {
                callback(event.target.result);
            };
        }

        function processInWebWorker(_function) {
            try {
                var blob = URL.createObjectURL(new Blob([_function.toString(),
                    'this.onmessage =  function (eee) {' + _function.name + '(eee.data);}'
                ], {
                    type: 'application/javascript'
                }));

                var worker = new Worker(blob);
                URL.revokeObjectURL(blob);
                return worker;
            } catch (e) {}
        }
    }

    function handleRecordingDuration(counter) {
        counter = counter || 0;

        if (self.state === 'paused') {
            setTimeout(function() {
                handleRecordingDuration(counter);
            }, 1000);
            return;
        }

        if (self.state === 'stopped') {
            return;
        }

        if (counter >= self.recordingDuration) {
            stopRecording(self.onRecordingStopped);
            return;
        }

        counter += 1000; // 1-second

        setTimeout(function() {
            handleRecordingDuration(counter);
        }, 1000);
    }

    function setState(state) {
        if (!self) {
            return;
        }

        self.state = state;

        if (typeof self.onStateChanged.call === 'function') {
            self.onStateChanged.call(self, state);
        } else {
            self.onStateChanged(state);
        }
    }

    var WARNING = 'It seems that recorder is destroyed or "startRecording" is not invoked for ' + config.type + ' recorder.';

    function warningLog() {
        if (config.disableLogs === true) {
            return;
        }

        console.warn(WARNING);
    }

    var mediaRecorder;

    var returnObject = {
        /**
         * This method starts the recording.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * var recorder = RecordRTC(mediaStream, {
         *     type: 'video'
         * });
         * recorder.startRecording();
         */
        startRecording: startRecording,

        /**
         * This method stops the recording. It is strongly recommended to get "blob" or "URI" inside the callback to make sure all recorders finished their job.
         * @param {function} callback - Callback to get the recorded blob.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recorder.stopRecording(function() {
         *     // use either "this" or "recorder" object; both are identical
         *     video.src = this.toURL();
         *     var blob = this.getBlob();
         * });
         */
        stopRecording: stopRecording,

        /**
         * This method pauses the recording. You can resume recording using "resumeRecording" method.
         * @method
         * @memberof RecordRTC
         * @instance
         * @todo Firefox is unable to pause the recording. Fix it.
         * @example
         * recorder.pauseRecording();  // pause the recording
         * recorder.resumeRecording(); // resume again
         */
        pauseRecording: pauseRecording,

        /**
         * This method resumes the recording.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recorder.pauseRecording();  // first of all, pause the recording
         * recorder.resumeRecording(); // now resume it
         */
        resumeRecording: resumeRecording,

        /**
         * This method initializes the recording.
         * @method
         * @memberof RecordRTC
         * @instance
         * @todo This method should be deprecated.
         * @example
         * recorder.initRecorder();
         */
        initRecorder: initRecorder,

        /**
         * Ask RecordRTC to auto-stop the recording after 5 minutes.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * var fiveMinutes = 5 * 1000 * 60;
         * recorder.setRecordingDuration(fiveMinutes, function() {
         *    var blob = this.getBlob();
         *    video.src = this.toURL();
         * });
         * 
         * // or otherwise
         * recorder.setRecordingDuration(fiveMinutes).onRecordingStopped(function() {
         *    var blob = this.getBlob();
         *    video.src = this.toURL();
         * });
         */
        setRecordingDuration: function(recordingDuration, callback) {
            if (typeof recordingDuration === 'undefined') {
                throw 'recordingDuration is required.';
            }

            if (typeof recordingDuration !== 'number') {
                throw 'recordingDuration must be a number.';
            }

            self.recordingDuration = recordingDuration;
            self.onRecordingStopped = callback || function() {};

            return {
                onRecordingStopped: function(callback) {
                    self.onRecordingStopped = callback;
                }
            };
        },

        /**
         * This method can be used to clear/reset all the recorded data.
         * @method
         * @memberof RecordRTC
         * @instance
         * @todo Figure out the difference between "reset" and "clearRecordedData" methods.
         * @example
         * recorder.clearRecordedData();
         */
        clearRecordedData: function() {
            if (!mediaRecorder) {
                warningLog();
                return;
            }

            mediaRecorder.clearRecordedData();

            if (!config.disableLogs) {
                console.log('Cleared old recorded data.');
            }
        },

        /**
         * Get the recorded blob. Use this method inside the "stopRecording" callback.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recorder.stopRecording(function() {
         *     var blob = this.getBlob();
         *
         *     var file = new File([blob], 'filename.webm', {
         *         type: 'video/webm'
         *     });
         *
         *     var formData = new FormData();
         *     formData.append('file', file); // upload "File" object rather than a "Blob"
         *     uploadToServer(formData);
         * });
         * @returns {Blob} Returns recorded data as "Blob" object.
         */
        getBlob: function() {
            if (!mediaRecorder) {
                warningLog();
                return;
            }

            return mediaRecorder.blob;
        },

        /**
         * Get data-URI instead of Blob.
         * @param {function} callback - Callback to get the Data-URI.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recorder.stopRecording(function() {
         *     recorder.getDataURL(function(dataURI) {
         *         video.src = dataURI;
         *     });
         * });
         */
        getDataURL: getDataURL,

        /**
         * Get virtual/temporary URL. Usage of this URL is limited to current tab.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recorder.stopRecording(function() {
         *     video.src = this.toURL();
         * });
         * @returns {String} Returns a virtual/temporary URL for the recorded "Blob".
         */
        toURL: function() {
            if (!mediaRecorder) {
                warningLog();
                return;
            }

            return URL.createObjectURL(mediaRecorder.blob);
        },

        /**
         * Get internal recording object (i.e. internal module) e.g. MutliStreamRecorder, MediaStreamRecorder, StereoAudioRecorder or WhammyRecorder etc.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * var internal = recorder.getInternalRecorder();
         * if(internal instanceof MultiStreamRecorder) {
         *     internal.addStreams([newAudioStream]);
         *     internal.resetVideoStreams([screenStream]);
         * }
         * @returns {Object} Returns internal recording object.
         */
        getInternalRecorder: function() {
            return mediaRecorder;
        },

        /**
         * Invoke save-as dialog to save the recorded blob into your disk.
         * @param {string} fileName - Set your own file name.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recorder.stopRecording(function() {
         *     this.save('file-name');
         *
         *     // or manually:
         *     invokeSaveAsDialog(this.getBlob(), 'filename.webm');
         * });
         */
        save: function(fileName) {
            if (!mediaRecorder) {
                warningLog();
                return;
            }

            invokeSaveAsDialog(mediaRecorder.blob, fileName);
        },

        /**
         * This method gets a blob from indexed-DB storage.
         * @param {function} callback - Callback to get the recorded blob.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recorder.getFromDisk(function(dataURL) {
         *     video.src = dataURL;
         * });
         */
        getFromDisk: function(callback) {
            if (!mediaRecorder) {
                warningLog();
                return;
            }

            RecordRTC.getFromDisk(config.type, callback);
        },

        /**
         * This method appends an array of webp images to the recorded video-blob. It takes an "array" object.
         * @type {Array.<Array>}
         * @param {Array} arrayOfWebPImages - Array of webp images.
         * @method
         * @memberof RecordRTC
         * @instance
         * @todo This method should be deprecated.
         * @example
         * var arrayOfWebPImages = [];
         * arrayOfWebPImages.push({
         *     duration: index,
         *     image: 'data:image/webp;base64,...'
         * });
         * recorder.setAdvertisementArray(arrayOfWebPImages);
         */
        setAdvertisementArray: function(arrayOfWebPImages) {
            config.advertisement = [];

            var length = arrayOfWebPImages.length;
            for (var i = 0; i < length; i++) {
                config.advertisement.push({
                    duration: i,
                    image: arrayOfWebPImages[i]
                });
            }
        },

        /**
         * It is equivalent to <code class="str">"recorder.getBlob()"</code> method. Usage of "getBlob" is recommended, though.
         * @property {Blob} blob - Recorded Blob can be accessed using this property.
         * @memberof RecordRTC
         * @instance
         * @readonly
         * @example
         * recorder.stopRecording(function() {
         *     var blob = this.blob;
         *
         *     // below one is recommended
         *     var blob = this.getBlob();
         * });
         */
        blob: null,

        /**
         * This works only with {recorderType:StereoAudioRecorder}. Use this property on "stopRecording" to verify the encoder's sample-rates.
         * @property {number} bufferSize - Buffer-size used to encode the WAV container
         * @memberof RecordRTC
         * @instance
         * @readonly
         * @example
         * recorder.stopRecording(function() {
         *     alert('Recorder used this buffer-size: ' + this.bufferSize);
         * });
         */
        bufferSize: 0,

        /**
         * This works only with {recorderType:StereoAudioRecorder}. Use this property on "stopRecording" to verify the encoder's sample-rates.
         * @property {number} sampleRate - Sample-rates used to encode the WAV container
         * @memberof RecordRTC
         * @instance
         * @readonly
         * @example
         * recorder.stopRecording(function() {
         *     alert('Recorder used these sample-rates: ' + this.sampleRate);
         * });
         */
        sampleRate: 0,

        /**
         * {recorderType:StereoAudioRecorder} returns ArrayBuffer object.
         * @property {ArrayBuffer} buffer - Audio ArrayBuffer, supported only in Chrome.
         * @memberof RecordRTC
         * @instance
         * @readonly
         * @example
         * recorder.stopRecording(function() {
         *     var arrayBuffer = this.buffer;
         *     alert(arrayBuffer.byteLength);
         * });
         */
        buffer: null,

        /**
         * This method resets the recorder. So that you can reuse single recorder instance many times.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recorder.reset();
         * recorder.startRecording();
         */
        reset: function() {
            if (mediaRecorder && typeof mediaRecorder.clearRecordedData === 'function') {
                mediaRecorder.clearRecordedData();
            }
            mediaRecorder = null;
            setState('inactive');
            self.blob = null;
        },

        /**
         * This method is called whenever recorder's state changes. Use this as an "event".
         * @property {String} state - A recorder's state can be: recording, paused, stopped or inactive.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recorder.onStateChanged = function(state) {
         *     console.log('Recorder state: ', state);
         * };
         */
        onStateChanged: function(state) {
            if (!config.disableLogs) {
                console.log('Recorder state changed:', state);
            }
        },

        /**
         * A recorder can have inactive, recording, paused or stopped states.
         * @property {String} state - A recorder's state can be: recording, paused, stopped or inactive.
         * @memberof RecordRTC
         * @static
         * @readonly
         * @example
         * // this looper function will keep you updated about the recorder's states.
         * (function looper() {
         *     document.querySelector('h1').innerHTML = 'Recorder\'s state is: ' + recorder.state;
         *     if(recorder.state === 'stopped') return; // ignore+stop
         *     setTimeout(looper, 1000); // update after every 3-seconds
         * })();
         * recorder.startRecording();
         */
        state: 'inactive',

        /**
         * Get recorder's readonly state.
         * @method
         * @memberof RecordRTC
         * @example
         * var state = recorder.getState();
         * @returns {String} Returns recording state.
         */
        getState: function() {
            return self.state;
        },

        /**
         * Destroy RecordRTC instance. Clear all recorders and objects.
         * @method
         * @memberof RecordRTC
         * @example
         * recorder.destroy();
         */
        destroy: function() {
            var disableLogsCache = config.disableLogs;

            config = {
                disableLogs: true
            };
            self.reset();
            setState('destroyed');
            returnObject = self = null;

            if (Storage.AudioContextConstructor) {
                Storage.AudioContextConstructor.close();
                Storage.AudioContextConstructor = null;
            }

            config.disableLogs = disableLogsCache;

            if (!config.disableLogs) {
                console.warn('RecordRTC is destroyed.');
            }
        },

        /**
         * RecordRTC version number
         * @property {String} version - Release version number.
         * @memberof RecordRTC
         * @static
         * @readonly
         * @example
         * alert(recorder.version);
         */
        version: '5.5.4'
    };

    if (!this) {
        self = returnObject;
        return returnObject;
    }

    // if someone wants to use RecordRTC with the "new" keyword.
    for (var prop in returnObject) {
        this[prop] = returnObject[prop];
    }

    self = this;

    return returnObject;
}

RecordRTC.version = '5.5.4';

if (typeof module !== 'undefined' /* && !!module.exports*/ ) {
    module.exports = RecordRTC;
}

if (typeof define === 'function' && define.amd) {
    define('RecordRTC', [], function() {
        return RecordRTC;
    });
}

RecordRTC.getFromDisk = function(type, callback) {
    if (!callback) {
        throw 'callback is mandatory.';
    }

    console.log('Getting recorded ' + (type === 'all' ? 'blobs' : type + ' blob ') + ' from disk!');
    DiskStorage.Fetch(function(dataURL, _type) {
        if (type !== 'all' && _type === type + 'Blob' && callback) {
            callback(dataURL);
        }

        if (type === 'all' && callback) {
            callback(dataURL, _type.replace('Blob', ''));
        }
    });
};

/**
 * This method can be used to store recorded blobs into IndexedDB storage.
 * @param {object} options - {audio: Blob, video: Blob, gif: Blob}
 * @method
 * @memberof RecordRTC
 * @example
 * RecordRTC.writeToDisk({
 *     audio: audioBlob,
 *     video: videoBlob,
 *     gif  : gifBlob
 * });
 */
RecordRTC.writeToDisk = function(options) {
    console.log('Writing recorded blob(s) to disk!');
    options = options || {};
    if (options.audio && options.video && options.gif) {
        options.audio.getDataURL(function(audioDataURL) {
            options.video.getDataURL(function(videoDataURL) {
                options.gif.getDataURL(function(gifDataURL) {
                    DiskStorage.Store({
                        audioBlob: audioDataURL,
                        videoBlob: videoDataURL,
                        gifBlob: gifDataURL
                    });
                });
            });
        });
    } else if (options.audio && options.video) {
        options.audio.getDataURL(function(audioDataURL) {
            options.video.getDataURL(function(videoDataURL) {
                DiskStorage.Store({
                    audioBlob: audioDataURL,
                    videoBlob: videoDataURL
                });
            });
        });
    } else if (options.audio && options.gif) {
        options.audio.getDataURL(function(audioDataURL) {
            options.gif.getDataURL(function(gifDataURL) {
                DiskStorage.Store({
                    audioBlob: audioDataURL,
                    gifBlob: gifDataURL
                });
            });
        });
    } else if (options.video && options.gif) {
        options.video.getDataURL(function(videoDataURL) {
            options.gif.getDataURL(function(gifDataURL) {
                DiskStorage.Store({
                    videoBlob: videoDataURL,
                    gifBlob: gifDataURL
                });
            });
        });
    } else if (options.audio) {
        options.audio.getDataURL(function(audioDataURL) {
            DiskStorage.Store({
                audioBlob: audioDataURL
            });
        });
    } else if (options.video) {
        options.video.getDataURL(function(videoDataURL) {
            DiskStorage.Store({
                videoBlob: videoDataURL
            });
        });
    } else if (options.gif) {
        options.gif.getDataURL(function(gifDataURL) {
            DiskStorage.Store({
                gifBlob: gifDataURL
            });
        });
    }
};

// __________________________
// RecordRTC-Configuration.js

/**
 * {@link RecordRTCConfiguration} is an inner/private helper for {@link RecordRTC}.
 * @summary It configures the 2nd parameter passed over {@link RecordRTC} and returns a valid "config" object.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef RecordRTCConfiguration
 * @class
 * @example
 * var options = RecordRTCConfiguration(mediaStream, options);
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {type:"video", disableLogs: true, numberOfAudioChannels: 1, bufferSize: 0, sampleRate: 0, video: HTMLVideoElement, getNativeBlob:true, etc.}
 */

function RecordRTCConfiguration(mediaStream, config) {
    if (!config.recorderType && !config.type) {
        if (!!config.audio && !!config.video) {
            config.type = 'video';
        } else if (!!config.audio && !config.video) {
            config.type = 'audio';
        }
    }

    if (config.recorderType && !config.type) {
        if (config.recorderType === WhammyRecorder || config.recorderType === CanvasRecorder || (typeof WebAssemblyRecorder !== 'undefined' && config.recorderType === WebAssemblyRecorder)) {
            config.type = 'video';
        } else if (config.recorderType === GifRecorder) {
            config.type = 'gif';
        } else if (config.recorderType === StereoAudioRecorder) {
            config.type = 'audio';
        } else if (config.recorderType === MediaStreamRecorder) {
            if (getTracks(mediaStream, 'audio').length && getTracks(mediaStream, 'video').length) {
                config.type = 'video';
            } else if (!getTracks(mediaStream, 'audio').length && getTracks(mediaStream, 'video').length) {
                config.type = 'video';
            } else if (getTracks(mediaStream, 'audio').length && !getTracks(mediaStream, 'video').length) {
                config.type = 'audio';
            } else {
                // config.type = 'UnKnown';
            }
        }
    }

    if (typeof MediaStreamRecorder !== 'undefined' && typeof MediaRecorder !== 'undefined' && 'requestData' in MediaRecorder.prototype) {
        if (!config.mimeType) {
            config.mimeType = 'video/webm';
        }

        if (!config.type) {
            config.type = config.mimeType.split('/')[0];
        }

        if (!config.bitsPerSecond) {
            // config.bitsPerSecond = 128000;
        }
    }

    // consider default type=audio
    if (!config.type) {
        if (config.mimeType) {
            config.type = config.mimeType.split('/')[0];
        }
        if (!config.type) {
            config.type = 'audio';
        }
    }

    return config;
}

// __________________
// GetRecorderType.js

/**
 * {@link GetRecorderType} is an inner/private helper for {@link RecordRTC}.
 * @summary It returns best recorder-type available for your browser.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef GetRecorderType
 * @class
 * @example
 * var RecorderType = GetRecorderType(options);
 * var recorder = new RecorderType(options);
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {type:"video", disableLogs: true, numberOfAudioChannels: 1, bufferSize: 0, sampleRate: 0, video: HTMLVideoElement, etc.}
 */

function GetRecorderType(mediaStream, config) {
    var recorder;

    // StereoAudioRecorder can work with all three: Edge, Firefox and Chrome
    // todo: detect if it is Edge, then auto use: StereoAudioRecorder
    if (isChrome || isEdge || isOpera) {
        // Media Stream Recording API has not been implemented in chrome yet;
        // That's why using WebAudio API to record stereo audio in WAV format
        recorder = StereoAudioRecorder;
    }

    if (typeof MediaRecorder !== 'undefined' && 'requestData' in MediaRecorder.prototype && !isChrome) {
        recorder = MediaStreamRecorder;
    }

    // video recorder (in WebM format)
    if (config.type === 'video' && (isChrome || isOpera)) {
        recorder = WhammyRecorder;

        if (typeof WebAssemblyRecorder !== 'undefined' && typeof ReadableStream !== 'undefined') {
            recorder = WebAssemblyRecorder;
        }
    }

    // video recorder (in Gif format)
    if (config.type === 'gif') {
        recorder = GifRecorder;
    }

    // html2canvas recording!
    if (config.type === 'canvas') {
        recorder = CanvasRecorder;
    }

    if (isMediaRecorderCompatible() && recorder !== CanvasRecorder && recorder !== GifRecorder && typeof MediaRecorder !== 'undefined' && 'requestData' in MediaRecorder.prototype) {
        if (getTracks(mediaStream, 'video').length || getTracks(mediaStream, 'audio').length) {
            // audio-only recording
            if (config.type === 'audio') {
                if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported('audio/webm')) {
                    recorder = MediaStreamRecorder;
                }
                // else recorder = StereoAudioRecorder;
            } else {
                // video or screen tracks
                if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported('video/webm')) {
                    recorder = MediaStreamRecorder;
                }
            }
        }
    }

    if (mediaStream instanceof Array && mediaStream.length) {
        recorder = MultiStreamRecorder;
    }

    if (config.recorderType) {
        recorder = config.recorderType;
    }

    if (!config.disableLogs && !!recorder && !!recorder.name) {
        console.log('Using recorderType:', recorder.name || recorder.constructor.name);
    }

    if (!recorder && isSafari) {
        recorder = MediaStreamRecorder;
    }

    return recorder;
}

// _____________
// MRecordRTC.js

/**
 * MRecordRTC runs on top of {@link RecordRTC} to bring multiple recordings in a single place, by providing simple API.
 * @summary MRecordRTC stands for "Multiple-RecordRTC".
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef MRecordRTC
 * @class
 * @example
 * var recorder = new MRecordRTC();
 * recorder.addStream(MediaStream);
 * recorder.mediaType = {
 *     audio: true, // or StereoAudioRecorder or MediaStreamRecorder
 *     video: true, // or WhammyRecorder or MediaStreamRecorder or WebAssemblyRecorder or CanvasRecorder
 *     gif: true    // or GifRecorder
 * };
 * // mimeType is optional and should be set only in advance cases.
 * recorder.mimeType = {
 *     audio: 'audio/wav',
 *     video: 'video/webm',
 *     gif:   'image/gif'
 * };
 * recorder.startRecording();
 * @see For further information:
 * @see {@link https://github.com/muaz-khan/RecordRTC/tree/master/MRecordRTC|MRecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @requires {@link RecordRTC}
 */

function MRecordRTC(mediaStream) {

    /**
     * This method attaches MediaStream object to {@link MRecordRTC}.
     * @param {MediaStream} mediaStream - A MediaStream object, either fetched using getUserMedia API, or generated using captureStreamUntilEnded or WebAudio API.
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.addStream(MediaStream);
     */
    this.addStream = function(_mediaStream) {
        if (_mediaStream) {
            mediaStream = _mediaStream;
        }
    };

    /**
     * This property can be used to set the recording type e.g. audio, or video, or gif, or canvas.
     * @property {object} mediaType - {audio: true, video: true, gif: true}
     * @memberof MRecordRTC
     * @example
     * var recorder = new MRecordRTC();
     * recorder.mediaType = {
     *     audio: true, // TRUE or StereoAudioRecorder or MediaStreamRecorder
     *     video: true, // TRUE or WhammyRecorder or MediaStreamRecorder or WebAssemblyRecorder or CanvasRecorder
     *     gif  : true  // TRUE or GifRecorder
     * };
     */
    this.mediaType = {
        audio: true,
        video: true
    };

    /**
     * This method starts recording.
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.startRecording();
     */
    this.startRecording = function() {
        var mediaType = this.mediaType;
        var recorderType;
        var mimeType = this.mimeType || {
            audio: null,
            video: null,
            gif: null
        };

        if (typeof mediaType.audio !== 'function' && isMediaRecorderCompatible() && !getTracks(mediaStream, 'audio').length) {
            mediaType.audio = false;
        }

        if (typeof mediaType.video !== 'function' && isMediaRecorderCompatible() && !getTracks(mediaStream, 'video').length) {
            mediaType.video = false;
        }

        if (typeof mediaType.gif !== 'function' && isMediaRecorderCompatible() && !getTracks(mediaStream, 'video').length) {
            mediaType.gif = false;
        }

        if (!mediaType.audio && !mediaType.video && !mediaType.gif) {
            throw 'MediaStream must have either audio or video tracks.';
        }

        if (!!mediaType.audio) {
            recorderType = null;
            if (typeof mediaType.audio === 'function') {
                recorderType = mediaType.audio;
            }

            this.audioRecorder = new RecordRTC(mediaStream, {
                type: 'audio',
                bufferSize: this.bufferSize,
                sampleRate: this.sampleRate,
                numberOfAudioChannels: this.numberOfAudioChannels || 2,
                disableLogs: this.disableLogs,
                recorderType: recorderType,
                mimeType: mimeType.audio,
                timeSlice: this.timeSlice,
                onTimeStamp: this.onTimeStamp
            });

            if (!mediaType.video) {
                this.audioRecorder.startRecording();
            }
        }

        if (!!mediaType.video) {
            recorderType = null;
            if (typeof mediaType.video === 'function') {
                recorderType = mediaType.video;
            }

            var newStream = mediaStream;

            if (isMediaRecorderCompatible() && !!mediaType.audio && typeof mediaType.audio === 'function') {
                var videoTrack = getTracks(mediaStream, 'video')[0];

                if (isFirefox) {
                    newStream = new MediaStream();
                    newStream.addTrack(videoTrack);

                    if (recorderType && recorderType === WhammyRecorder) {
                        // Firefox does NOT supports webp-encoding yet
                        // But Firefox do supports WebAssemblyRecorder
                        recorderType = MediaStreamRecorder;
                    }
                } else {
                    newStream = new MediaStream();
                    newStream.addTrack(videoTrack);
                }
            }

            this.videoRecorder = new RecordRTC(newStream, {
                type: 'video',
                video: this.video,
                canvas: this.canvas,
                frameInterval: this.frameInterval || 10,
                disableLogs: this.disableLogs,
                recorderType: recorderType,
                mimeType: mimeType.video,
                timeSlice: this.timeSlice,
                onTimeStamp: this.onTimeStamp,
                workerPath: this.workerPath,
                webAssemblyPath: this.webAssemblyPath,
                frameRate: this.frameRate, // used by WebAssemblyRecorder; values: usually 30; accepts any.
                bitrate: this.bitrate // used by WebAssemblyRecorder; values: 0 to 1000+
            });

            if (!mediaType.audio) {
                this.videoRecorder.startRecording();
            }
        }

        if (!!mediaType.audio && !!mediaType.video) {
            var self = this;

            var isSingleRecorder = isMediaRecorderCompatible() === true;

            if (mediaType.audio instanceof StereoAudioRecorder && !!mediaType.video) {
                isSingleRecorder = false;
            } else if (mediaType.audio !== true && mediaType.video !== true && mediaType.audio !== mediaType.video) {
                isSingleRecorder = false;
            }

            if (isSingleRecorder === true) {
                self.audioRecorder = null;
                self.videoRecorder.startRecording();
            } else {
                self.videoRecorder.initRecorder(function() {
                    self.audioRecorder.initRecorder(function() {
                        // Both recorders are ready to record things accurately
                        self.videoRecorder.startRecording();
                        self.audioRecorder.startRecording();
                    });
                });
            }
        }

        if (!!mediaType.gif) {
            recorderType = null;
            if (typeof mediaType.gif === 'function') {
                recorderType = mediaType.gif;
            }
            this.gifRecorder = new RecordRTC(mediaStream, {
                type: 'gif',
                frameRate: this.frameRate || 200,
                quality: this.quality || 10,
                disableLogs: this.disableLogs,
                recorderType: recorderType,
                mimeType: mimeType.gif
            });
            this.gifRecorder.startRecording();
        }
    };

    /**
     * This method stops recording.
     * @param {function} callback - Callback function is invoked when all encoders finished their jobs.
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.stopRecording(function(recording){
     *     var audioBlob = recording.audio;
     *     var videoBlob = recording.video;
     *     var gifBlob   = recording.gif;
     * });
     */
    this.stopRecording = function(callback) {
        callback = callback || function() {};

        if (this.audioRecorder) {
            this.audioRecorder.stopRecording(function(blobURL) {
                callback(blobURL, 'audio');
            });
        }

        if (this.videoRecorder) {
            this.videoRecorder.stopRecording(function(blobURL) {
                callback(blobURL, 'video');
            });
        }

        if (this.gifRecorder) {
            this.gifRecorder.stopRecording(function(blobURL) {
                callback(blobURL, 'gif');
            });
        }
    };

    /**
     * This method pauses recording.
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.pauseRecording();
     */
    this.pauseRecording = function() {
        if (this.audioRecorder) {
            this.audioRecorder.pauseRecording();
        }

        if (this.videoRecorder) {
            this.videoRecorder.pauseRecording();
        }

        if (this.gifRecorder) {
            this.gifRecorder.pauseRecording();
        }
    };

    /**
     * This method resumes recording.
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.resumeRecording();
     */
    this.resumeRecording = function() {
        if (this.audioRecorder) {
            this.audioRecorder.resumeRecording();
        }

        if (this.videoRecorder) {
            this.videoRecorder.resumeRecording();
        }

        if (this.gifRecorder) {
            this.gifRecorder.resumeRecording();
        }
    };

    /**
     * This method can be used to manually get all recorded blobs.
     * @param {function} callback - All recorded blobs are passed back to the "callback" function.
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.getBlob(function(recording){
     *     var audioBlob = recording.audio;
     *     var videoBlob = recording.video;
     *     var gifBlob   = recording.gif;
     * });
     * // or
     * var audioBlob = recorder.getBlob().audio;
     * var videoBlob = recorder.getBlob().video;
     */
    this.getBlob = function(callback) {
        var output = {};

        if (this.audioRecorder) {
            output.audio = this.audioRecorder.getBlob();
        }

        if (this.videoRecorder) {
            output.video = this.videoRecorder.getBlob();
        }

        if (this.gifRecorder) {
            output.gif = this.gifRecorder.getBlob();
        }

        if (callback) {
            callback(output);
        }

        return output;
    };

    /**
     * Destroy all recorder instances.
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.destroy();
     */
    this.destroy = function() {
        if (this.audioRecorder) {
            this.audioRecorder.destroy();
            this.audioRecorder = null;
        }

        if (this.videoRecorder) {
            this.videoRecorder.destroy();
            this.videoRecorder = null;
        }

        if (this.gifRecorder) {
            this.gifRecorder.destroy();
            this.gifRecorder = null;
        }
    };

    /**
     * This method can be used to manually get all recorded blobs' DataURLs.
     * @param {function} callback - All recorded blobs' DataURLs are passed back to the "callback" function.
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.getDataURL(function(recording){
     *     var audioDataURL = recording.audio;
     *     var videoDataURL = recording.video;
     *     var gifDataURL   = recording.gif;
     * });
     */
    this.getDataURL = function(callback) {
        this.getBlob(function(blob) {
            if (blob.audio && blob.video) {
                getDataURL(blob.audio, function(_audioDataURL) {
                    getDataURL(blob.video, function(_videoDataURL) {
                        callback({
                            audio: _audioDataURL,
                            video: _videoDataURL
                        });
                    });
                });
            } else if (blob.audio) {
                getDataURL(blob.audio, function(_audioDataURL) {
                    callback({
                        audio: _audioDataURL
                    });
                });
            } else if (blob.video) {
                getDataURL(blob.video, function(_videoDataURL) {
                    callback({
                        video: _videoDataURL
                    });
                });
            }
        });

        function getDataURL(blob, callback00) {
            if (typeof Worker !== 'undefined') {
                var webWorker = processInWebWorker(function readFile(_blob) {
                    postMessage(new FileReaderSync().readAsDataURL(_blob));
                });

                webWorker.onmessage = function(event) {
                    callback00(event.data);
                };

                webWorker.postMessage(blob);
            } else {
                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = function(event) {
                    callback00(event.target.result);
                };
            }
        }

        function processInWebWorker(_function) {
            var blob = URL.createObjectURL(new Blob([_function.toString(),
                'this.onmessage =  function (eee) {' + _function.name + '(eee.data);}'
            ], {
                type: 'application/javascript'
            }));

            var worker = new Worker(blob);
            var url;
            if (typeof URL !== 'undefined') {
                url = URL;
            } else if (typeof webkitURL !== 'undefined') {
                url = webkitURL;
            } else {
                throw 'Neither URL nor webkitURL detected.';
            }
            url.revokeObjectURL(blob);
            return worker;
        }
    };

    /**
     * This method can be used to ask {@link MRecordRTC} to write all recorded blobs into IndexedDB storage.
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.writeToDisk();
     */
    this.writeToDisk = function() {
        RecordRTC.writeToDisk({
            audio: this.audioRecorder,
            video: this.videoRecorder,
            gif: this.gifRecorder
        });
    };

    /**
     * This method can be used to invoke a save-as dialog for all recorded blobs.
     * @param {object} args - {audio: 'audio-name', video: 'video-name', gif: 'gif-name'}
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.save({
     *     audio: 'audio-file-name',
     *     video: 'video-file-name',
     *     gif  : 'gif-file-name'
     * });
     */
    this.save = function(args) {
        args = args || {
            audio: true,
            video: true,
            gif: true
        };

        if (!!args.audio && this.audioRecorder) {
            this.audioRecorder.save(typeof args.audio === 'string' ? args.audio : '');
        }

        if (!!args.video && this.videoRecorder) {
            this.videoRecorder.save(typeof args.video === 'string' ? args.video : '');
        }
        if (!!args.gif && this.gifRecorder) {
            this.gifRecorder.save(typeof args.gif === 'string' ? args.gif : '');
        }
    };
}

/**
 * This method can be used to get all recorded blobs from IndexedDB storage.
 * @param {string} type - 'all' or 'audio' or 'video' or 'gif'
 * @param {function} callback - Callback function to get all stored blobs.
 * @method
 * @memberof MRecordRTC
 * @example
 * MRecordRTC.getFromDisk('all', function(dataURL, type){
 *     if(type === 'audio') { }
 *     if(type === 'video') { }
 *     if(type === 'gif')   { }
 * });
 */
MRecordRTC.getFromDisk = RecordRTC.getFromDisk;

/**
 * This method can be used to store recorded blobs into IndexedDB storage.
 * @param {object} options - {audio: Blob, video: Blob, gif: Blob}
 * @method
 * @memberof MRecordRTC
 * @example
 * MRecordRTC.writeToDisk({
 *     audio: audioBlob,
 *     video: videoBlob,
 *     gif  : gifBlob
 * });
 */
MRecordRTC.writeToDisk = RecordRTC.writeToDisk;

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.MRecordRTC = MRecordRTC;
}

var browserFakeUserAgent = 'Fake/5.0 (FakeOS) AppleWebKit/123 (KHTML, like Gecko) Fake/12.3.4567.89 Fake/123.45';

(function(that) {
    if (!that) {
        return;
    }

    if (typeof window !== 'undefined') {
        return;
    }

    if (typeof global === 'undefined') {
        return;
    }

    global.navigator = {
        userAgent: browserFakeUserAgent,
        getUserMedia: function() {}
    };

    if (!global.console) {
        global.console = {};
    }

    if (typeof global.console.log === 'undefined' || typeof global.console.error === 'undefined') {
        global.console.error = global.console.log = global.console.log || function() {
            console.log(arguments);
        };
    }

    if (typeof document === 'undefined') {
        /*global document:true */
        that.document = {};

        document.createElement = document.captureStream = document.mozCaptureStream = function() {
            var obj = {
                getContext: function() {
                    return obj;
                },
                play: function() {},
                pause: function() {},
                drawImage: function() {},
                toDataURL: function() {
                    return '';
                }
            };
            return obj;
        };

        that.HTMLVideoElement = function() {};
    }

    if (typeof location === 'undefined') {
        /*global location:true */
        that.location = {
            protocol: 'file:',
            href: '',
            hash: ''
        };
    }

    if (typeof screen === 'undefined') {
        /*global screen:true */
        that.screen = {
            width: 0,
            height: 0
        };
    }

    if (typeof URL === 'undefined') {
        /*global screen:true */
        that.URL = {
            createObjectURL: function() {
                return '';
            },
            revokeObjectURL: function() {
                return '';
            }
        };
    }

    /*global window:true */
    that.window = global;
})(typeof global !== 'undefined' ? global : null);

// _____________________________
// Cross-Browser-Declarations.js

// animation-frame used in WebM recording

/*jshint -W079 */
var requestAnimationFrame = window.requestAnimationFrame;
if (typeof requestAnimationFrame === 'undefined') {
    if (typeof webkitRequestAnimationFrame !== 'undefined') {
        /*global requestAnimationFrame:true */
        requestAnimationFrame = webkitRequestAnimationFrame;
    } else if (typeof mozRequestAnimationFrame !== 'undefined') {
        /*global requestAnimationFrame:true */
        requestAnimationFrame = mozRequestAnimationFrame;
    } else if (typeof msRequestAnimationFrame !== 'undefined') {
        /*global requestAnimationFrame:true */
        requestAnimationFrame = msRequestAnimationFrame;
    } else if (typeof requestAnimationFrame === 'undefined') {
        // via: https://gist.github.com/paulirish/1579671
        var lastTime = 0;

        /*global requestAnimationFrame:true */
        requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
}

/*jshint -W079 */
var cancelAnimationFrame = window.cancelAnimationFrame;
if (typeof cancelAnimationFrame === 'undefined') {
    if (typeof webkitCancelAnimationFrame !== 'undefined') {
        /*global cancelAnimationFrame:true */
        cancelAnimationFrame = webkitCancelAnimationFrame;
    } else if (typeof mozCancelAnimationFrame !== 'undefined') {
        /*global cancelAnimationFrame:true */
        cancelAnimationFrame = mozCancelAnimationFrame;
    } else if (typeof msCancelAnimationFrame !== 'undefined') {
        /*global cancelAnimationFrame:true */
        cancelAnimationFrame = msCancelAnimationFrame;
    } else if (typeof cancelAnimationFrame === 'undefined') {
        /*global cancelAnimationFrame:true */
        cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}

// WebAudio API representer
var AudioContext = window.AudioContext;

if (typeof AudioContext === 'undefined') {
    if (typeof webkitAudioContext !== 'undefined') {
        /*global AudioContext:true */
        AudioContext = webkitAudioContext;
    }

    if (typeof mozAudioContext !== 'undefined') {
        /*global AudioContext:true */
        AudioContext = mozAudioContext;
    }
}

/*jshint -W079 */
var URL = window.URL;

if (typeof URL === 'undefined' && typeof webkitURL !== 'undefined') {
    /*global URL:true */
    URL = webkitURL;
}

if (typeof navigator !== 'undefined' && typeof navigator.getUserMedia === 'undefined') { // maybe window.navigator?
    if (typeof navigator.webkitGetUserMedia !== 'undefined') {
        navigator.getUserMedia = navigator.webkitGetUserMedia;
    }

    if (typeof navigator.mozGetUserMedia !== 'undefined') {
        navigator.getUserMedia = navigator.mozGetUserMedia;
    }
}

var isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveBlob || !!navigator.msSaveOrOpenBlob);
var isOpera = !!window.opera || navigator.userAgent.indexOf('OPR/') !== -1;
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && ('netscape' in window) && / rv:/.test(navigator.userAgent);
var isChrome = (!isOpera && !isEdge && !!navigator.webkitGetUserMedia) || isElectron() || navigator.userAgent.toLowerCase().indexOf('chrome/') !== -1;

var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (isSafari && !isChrome && navigator.userAgent.indexOf('CriOS') !== -1) {
    isSafari = false;
    isChrome = true;
}

var MediaStream = window.MediaStream;

if (typeof MediaStream === 'undefined' && typeof webkitMediaStream !== 'undefined') {
    MediaStream = webkitMediaStream;
}

/*global MediaStream:true */
if (typeof MediaStream !== 'undefined') {
    // override "stop" method for all browsers
    if (typeof MediaStream.prototype.stop === 'undefined') {
        MediaStream.prototype.stop = function() {
            this.getTracks().forEach(function(track) {
                track.stop();
            });
        };
    }
}

// below function via: http://goo.gl/B3ae8c
/**
 * Return human-readable file size.
 * @param {number} bytes - Pass bytes and get formatted string.
 * @returns {string} - formatted string
 * @example
 * bytesToSize(1024*1024*5) === '5 GB'
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */
function bytesToSize(bytes) {
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
        return '0 Bytes';
    }
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

/**
 * @param {Blob} file - File or Blob object. This parameter is required.
 * @param {string} fileName - Optional file name e.g. "Recorded-Video.webm"
 * @example
 * invokeSaveAsDialog(blob or file, [optional] fileName);
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */
function invokeSaveAsDialog(file, fileName) {
    if (!file) {
        throw 'Blob object is required.';
    }

    if (!file.type) {
        try {
            file.type = 'video/webm';
        } catch (e) {}
    }

    var fileExtension = (file.type || 'video/webm').split('/')[1];

    if (fileName && fileName.indexOf('.') !== -1) {
        var splitted = fileName.split('.');
        fileName = splitted[0];
        fileExtension = splitted[1];
    }

    var fileFullName = (fileName || (Math.round(Math.random() * 9999999999) + 888888888)) + '.' + fileExtension;

    if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
        return navigator.msSaveOrOpenBlob(file, fileFullName);
    } else if (typeof navigator.msSaveBlob !== 'undefined') {
        return navigator.msSaveBlob(file, fileFullName);
    }

    var hyperlink = document.createElement('a');
    hyperlink.href = URL.createObjectURL(file);
    hyperlink.download = fileFullName;

    hyperlink.style = 'display:none;opacity:0;color:transparent;';
    (document.body || document.documentElement).appendChild(hyperlink);

    if (typeof hyperlink.click === 'function') {
        hyperlink.click();
    } else {
        hyperlink.target = '_blank';
        hyperlink.dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        }));
    }

    URL.revokeObjectURL(hyperlink.href);
}

/**
 * from: https://github.com/cheton/is-electron/blob/master/index.js
 **/
function isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }

    return false;
}

function getTracks(stream, kind) {
    if (!stream || !stream.getTracks) {
        return [];
    }

    return stream.getTracks().filter(function(t) {
        return t.kind === (kind || 'audio');
    });
}

function setSrcObject(stream, element) {
    if ('srcObject' in element) {
        element.srcObject = stream;
    } else if ('mozSrcObject' in element) {
        element.mozSrcObject = stream;
    } else {
        element.srcObject = stream;
    }
}

/**
 * @param {Blob} file - File or Blob object.
 * @param {function} callback - Callback function.
 * @example
 * getSeekableBlob(blob or file, callback);
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */
function getSeekableBlob(inputBlob, callback) {
    // EBML.js copyrights goes to: https://github.com/legokichi/ts-ebml
    if (typeof EBML === 'undefined') {
        throw new Error('Please link: https://cdn.webrtc-experiment.com/EBML.js');
    }

    var reader = new EBML.Reader();
    var decoder = new EBML.Decoder();
    var tools = EBML.tools;

    var fileReader = new FileReader();
    fileReader.onload = function(e) {
        var ebmlElms = decoder.decode(this.result);
        ebmlElms.forEach(function(element) {
            reader.read(element);
        });
        reader.stop();
        var refinedMetadataBuf = tools.makeMetadataSeekable(reader.metadatas, reader.duration, reader.cues);
        var body = this.result.slice(reader.metadataSize);
        var newBlob = new Blob([refinedMetadataBuf, body], {
            type: 'video/webm'
        });

        callback(newBlob);
    };
    fileReader.readAsArrayBuffer(inputBlob);
}

// __________ (used to handle stuff like http://goo.gl/xmE5eg) issue #129
// Storage.js

/**
 * Storage is a standalone object used by {@link RecordRTC} to store reusable objects e.g. "new AudioContext".
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @example
 * Storage.AudioContext === webkitAudioContext
 * @property {webkitAudioContext} AudioContext - Keeps a reference to AudioContext object.
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */

var Storage = {};

if (typeof AudioContext !== 'undefined') {
    Storage.AudioContext = AudioContext;
} else if (typeof webkitAudioContext !== 'undefined') {
    Storage.AudioContext = webkitAudioContext;
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.Storage = Storage;
}

function isMediaRecorderCompatible() {
    if (isFirefox || isSafari || isEdge) {
        return true;
    }

    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    if (isChrome || isOpera) {
        verOffset = nAgt.indexOf('Chrome');
        fullVersion = nAgt.substring(verOffset + 7);
    }

    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(';')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
    }

    if ((ix = fullVersion.indexOf(' ')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
    }

    majorVersion = parseInt('' + fullVersion, 10);

    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    return majorVersion >= 49;
}

// ______________________
// MediaStreamRecorder.js

/**
 * MediaStreamRecorder is an abstraction layer for {@link https://w3c.github.io/mediacapture-record/MediaRecorder.html|MediaRecorder API}. It is used by {@link RecordRTC} to record MediaStream(s) in both Chrome and Firefox.
 * @summary Runs top over {@link https://w3c.github.io/mediacapture-record/MediaRecorder.html|MediaRecorder API}.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link https://github.com/muaz-khan|Muaz Khan}
 * @typedef MediaStreamRecorder
 * @class
 * @example
 * var config = {
 *     mimeType: 'video/webm', // vp8, vp9, h264, mkv, opus/vorbis
 *     audioBitsPerSecond : 256 * 8 * 1024,
 *     videoBitsPerSecond : 256 * 8 * 1024,
 *     bitsPerSecond: 256 * 8 * 1024,  // if this is provided, skip above two
 *     checkForInactiveTracks: true,
 *     timeSlice: 1000, // concatenate intervals based blobs
 *     ondataavailable: function() {} // get intervals based blobs
 * }
 * var recorder = new MediaStreamRecorder(mediaStream, config);
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 *
 *     // or
 *     var blob = recorder.blob;
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {disableLogs:true, initCallback: function, mimeType: "video/webm", timeSlice: 1000}
 * @throws Will throw an error if first argument "MediaStream" is missing. Also throws error if "MediaRecorder API" are not supported by the browser.
 */

function MediaStreamRecorder(mediaStream, config) {
    var self = this;

    if (typeof mediaStream === 'undefined') {
        throw 'First argument "MediaStream" is required.';
    }

    if (typeof MediaRecorder === 'undefined') {
        throw 'Your browser does not supports Media Recorder API. Please try other modules e.g. WhammyRecorder or StereoAudioRecorder.';
    }

    config = config || {
        // bitsPerSecond: 256 * 8 * 1024,
        mimeType: 'video/webm'
    };

    if (config.type === 'audio') {
        if (getTracks(mediaStream, 'video').length && getTracks(mediaStream, 'audio').length) {
            var stream;
            if (!!navigator.mozGetUserMedia) {
                stream = new MediaStream();
                stream.addTrack(getTracks(mediaStream, 'audio')[0]);
            } else {
                // webkitMediaStream
                stream = new MediaStream(getTracks(mediaStream, 'audio'));
            }
            mediaStream = stream;
        }

        if (!config.mimeType || config.mimeType.toString().toLowerCase().indexOf('audio') === -1) {
            config.mimeType = isChrome ? 'audio/webm' : 'audio/ogg';
        }

        if (config.mimeType && config.mimeType.toString().toLowerCase() !== 'audio/ogg' && !!navigator.mozGetUserMedia) {
            // forcing better codecs on Firefox (via #166)
            config.mimeType = 'audio/ogg';
        }
    }

    var arrayOfBlobs = [];

    /**
     * This method returns array of blobs. Use only with "timeSlice". Its useful to preview recording anytime, without using the "stop" method.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * var arrayOfBlobs = recorder.getArrayOfBlobs();
     * @returns {Array} Returns array of recorded blobs.
     */
    this.getArrayOfBlobs = function() {
        return arrayOfBlobs;
    };

    /**
     * This method records MediaStream.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.record();
     */
    this.record = function() {
        // set defaults
        self.blob = null;
        self.clearRecordedData();
        self.timestamps = [];
        allStates = [];
        arrayOfBlobs = [];

        var recorderHints = config;

        if (!config.disableLogs) {
            console.log('Passing following config over MediaRecorder API.', recorderHints);
        }

        if (mediaRecorder) {
            // mandatory to make sure Firefox doesn't fails to record streams 3-4 times without reloading the page.
            mediaRecorder = null;
        }

        if (isChrome && !isMediaRecorderCompatible()) {
            // to support video-only recording on stable
            recorderHints = 'video/vp8';
        }

        if (typeof MediaRecorder.isTypeSupported === 'function' && recorderHints.mimeType) {
            if (!MediaRecorder.isTypeSupported(recorderHints.mimeType)) {
                if (!config.disableLogs) {
                    console.warn('MediaRecorder API seems unable to record mimeType:', recorderHints.mimeType);
                }

                recorderHints.mimeType = config.type === 'audio' ? 'audio/webm' : 'video/webm';
            }
        }

        // using MediaRecorder API here
        try {
            mediaRecorder = new MediaRecorder(mediaStream, recorderHints);

            // reset
            config.mimeType = recorderHints.mimeType;
        } catch (e) {
            // chrome-based fallback
            mediaRecorder = new MediaRecorder(mediaStream);
        }

        // old hack?
        if (recorderHints.mimeType && !MediaRecorder.isTypeSupported && 'canRecordMimeType' in mediaRecorder && mediaRecorder.canRecordMimeType(recorderHints.mimeType) === false) {
            if (!config.disableLogs) {
                console.warn('MediaRecorder API seems unable to record mimeType:', recorderHints.mimeType);
            }
        }

        // Dispatching OnDataAvailable Handler
        mediaRecorder.ondataavailable = function(e) {
            if (e.data) {
                allStates.push('ondataavailable: ' + bytesToSize(e.data.size));
            }

            if (typeof config.timeSlice === 'number') {
                if (e.data && e.data.size && e.data.size > 100) {
                    arrayOfBlobs.push(e.data);
                    updateTimeStamp();

                    if (typeof config.ondataavailable === 'function') {
                        // intervals based blobs
                        var blob = config.getNativeBlob ? e.data : new Blob([e.data], {
                            type: getMimeType(recorderHints)
                        });
                        config.ondataavailable(blob);
                    }
                }
                return;
            }

            if (!e.data || !e.data.size || e.data.size < 100 || self.blob) {
                // make sure that stopRecording always getting fired
                // even if there is invalid data
                if (self.recordingCallback) {
                    self.recordingCallback(new Blob([], {
                        type: getMimeType(recorderHints)
                    }));
                    self.recordingCallback = null;
                }
                return;
            }

            self.blob = config.getNativeBlob ? e.data : new Blob([e.data], {
                type: getMimeType(recorderHints)
            });

            if (self.recordingCallback) {
                self.recordingCallback(self.blob);
                self.recordingCallback = null;
            }
        };

        mediaRecorder.onstart = function() {
            allStates.push('started');
        };

        mediaRecorder.onpause = function() {
            allStates.push('paused');
        };

        mediaRecorder.onresume = function() {
            allStates.push('resumed');
        };

        mediaRecorder.onstop = function() {
            allStates.push('stopped');
        };

        mediaRecorder.onerror = function(error) {
            if (!error) {
                return;
            }

            if (!error.name) {
                error.name = 'UnknownError';
            }

            allStates.push('error: ' + error);

            if (!config.disableLogs) {
                // via: https://w3c.github.io/mediacapture-record/MediaRecorder.html#exception-summary
                if (error.name.toString().toLowerCase().indexOf('invalidstate') !== -1) {
                    console.error('The MediaRecorder is not in a state in which the proposed operation is allowed to be executed.', error);
                } else if (error.name.toString().toLowerCase().indexOf('notsupported') !== -1) {
                    console.error('MIME type (', recorderHints.mimeType, ') is not supported.', error);
                } else if (error.name.toString().toLowerCase().indexOf('security') !== -1) {
                    console.error('MediaRecorder security error', error);
                }

                // older code below
                else if (error.name === 'OutOfMemory') {
                    console.error('The UA has exhaused the available memory. User agents SHOULD provide as much additional information as possible in the message attribute.', error);
                } else if (error.name === 'IllegalStreamModification') {
                    console.error('A modification to the stream has occurred that makes it impossible to continue recording. An example would be the addition of a Track while recording is occurring. User agents SHOULD provide as much additional information as possible in the message attribute.', error);
                } else if (error.name === 'OtherRecordingError') {
                    console.error('Used for an fatal error other than those listed above. User agents SHOULD provide as much additional information as possible in the message attribute.', error);
                } else if (error.name === 'GenericError') {
                    console.error('The UA cannot provide the codec or recording option that has been requested.', error);
                } else {
                    console.error('MediaRecorder Error', error);
                }
            }

            (function(looper) {
                if (!self.manuallyStopped && mediaRecorder && mediaRecorder.state === 'inactive') {
                    delete config.timeslice;

                    // 10 minutes, enough?
                    mediaRecorder.start(10 * 60 * 1000);
                    return;
                }

                setTimeout(looper, 1000);
            })();

            if (mediaRecorder.state !== 'inactive' && mediaRecorder.state !== 'stopped') {
                mediaRecorder.stop();
            }
        };

        if (typeof config.timeSlice === 'number') {
            updateTimeStamp();
            mediaRecorder.start(config.timeSlice);
        } else {
            // default is 60 minutes; enough?
            // use config => {timeSlice: 1000} otherwise

            mediaRecorder.start(3.6e+6);
        }

        if (config.initCallback) {
            config.initCallback(); // old code
        }
    };

    /**
     * @property {Array} timestamps - Array of time stamps
     * @memberof MediaStreamRecorder
     * @example
     * console.log(recorder.timestamps);
     */
    this.timestamps = [];

    function updateTimeStamp() {
        self.timestamps.push(new Date().getTime());

        if (typeof config.onTimeStamp === 'function') {
            config.onTimeStamp(self.timestamps[self.timestamps.length - 1], self.timestamps);
        }
    }

    function getMimeType(secondObject) {
        if (mediaRecorder && mediaRecorder.mimeType) {
            return mediaRecorder.mimeType;
        }

        return secondObject.mimeType || 'video/webm';
    }

    /**
     * This method stops recording MediaStream.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.stop(function(blob) {
     *     video.src = URL.createObjectURL(blob);
     * });
     */
    this.stop = function(callback) {
        callback = callback || function() {};

        self.manuallyStopped = true; // used inside the mediaRecorder.onerror

        if (!mediaRecorder) {
            return;
        }

        this.recordingCallback = callback;

        if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }

        if (typeof config.timeSlice === 'number') {
            setTimeout(function() {
                self.blob = new Blob(arrayOfBlobs, {
                    type: getMimeType(config)
                });

                self.recordingCallback(self.blob);
            }, 100);
        }
    };

    /**
     * This method pauses the recording process.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.pause();
     */
    this.pause = function() {
        if (!mediaRecorder) {
            return;
        }

        if (mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
        }
    };

    /**
     * This method resumes the recording process.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.resume();
     */
    this.resume = function() {
        if (!mediaRecorder) {
            return;
        }

        if (mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
        }
    };

    /**
     * This method resets currently recorded data.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.clearRecordedData();
     */
    this.clearRecordedData = function() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            self.stop(clearRecordedDataCB);
        }

        clearRecordedDataCB();
    };

    function clearRecordedDataCB() {
        arrayOfBlobs = [];
        mediaRecorder = null;
        self.timestamps = [];
    }

    // Reference to "MediaRecorder" object
    var mediaRecorder;

    /**
     * Access to native MediaRecorder API
     * @method
     * @memberof MediaStreamRecorder
     * @instance
     * @example
     * var internal = recorder.getInternalRecorder();
     * internal.ondataavailable = function() {}; // override
     * internal.stream, internal.onpause, internal.onstop, etc.
     * @returns {Object} Returns internal recording object.
     */
    this.getInternalRecorder = function() {
        return mediaRecorder;
    };

    function isMediaStreamActive() {
        if ('active' in mediaStream) {
            if (!mediaStream.active) {
                return false;
            }
        } else if ('ended' in mediaStream) { // old hack
            if (mediaStream.ended) {
                return false;
            }
        }
        return true;
    }

    /**
     * @property {Blob} blob - Recorded data as "Blob" object.
     * @memberof MediaStreamRecorder
     * @example
     * recorder.stop(function() {
     *     var blob = recorder.blob;
     * });
     */
    this.blob = null;


    /**
     * Get MediaRecorder readonly state.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * var state = recorder.getState();
     * @returns {String} Returns recording state.
     */
    this.getState = function() {
        if (!mediaRecorder) {
            return 'inactive';
        }

        return mediaRecorder.state || 'inactive';
    };

    // list of all recording states
    var allStates = [];

    /**
     * Get MediaRecorder all recording states.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * var state = recorder.getAllStates();
     * @returns {Array} Returns all recording states
     */
    this.getAllStates = function() {
        return allStates;
    };

    // if any Track within the MediaStream is muted or not enabled at any time, 
    // the browser will only record black frames 
    // or silence since that is the content produced by the Track
    // so we need to stopRecording as soon as any single track ends.
    if (typeof config.checkForInactiveTracks === 'undefined') {
        config.checkForInactiveTracks = false; // disable to minimize CPU usage
    }

    var self = this;

    // this method checks if media stream is stopped
    // or if any track is ended.
    (function looper() {
        if (!mediaRecorder || config.checkForInactiveTracks === false) {
            return;
        }

        if (isMediaStreamActive() === false) {
            if (!config.disableLogs) {
                console.log('MediaStream seems stopped.');
            }
            self.stop();
            return;
        }

        setTimeout(looper, 1000); // check every second
    })();

    // for debugging
    this.name = 'MediaStreamRecorder';
    this.toString = function() {
        return this.name;
    };
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.MediaStreamRecorder = MediaStreamRecorder;
}

// source code from: http://typedarray.org/wp-content/projects/WebAudioRecorder/script.js
// https://github.com/mattdiamond/Recorderjs#license-mit
// ______________________
// StereoAudioRecorder.js

/**
 * StereoAudioRecorder is a standalone class used by {@link RecordRTC} to bring "stereo" audio-recording in chrome.
 * @summary JavaScript standalone object for stereo audio recording.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef StereoAudioRecorder
 * @class
 * @example
 * var recorder = new StereoAudioRecorder(MediaStream, {
 *     sampleRate: 44100,
 *     bufferSize: 4096
 * });
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {sampleRate: 44100, bufferSize: 4096, numberOfAudioChannels: 1, etc.}
 */

function StereoAudioRecorder(mediaStream, config) {
    if (!getTracks(mediaStream, 'audio').length) {
        throw 'Your stream has no audio tracks.';
    }

    config = config || {};

    var self = this;

    // variables
    var leftchannel = [];
    var rightchannel = [];
    var recording = false;
    var recordingLength = 0;
    var jsAudioNode;

    var numberOfAudioChannels = 2;

    /**
     * Set sample rates such as 8K or 16K. Reference: http://stackoverflow.com/a/28977136/552182
     * @property {number} desiredSampRate - Desired Bits per sample * 1000
     * @memberof StereoAudioRecorder
     * @instance
     * @example
     * var recorder = StereoAudioRecorder(mediaStream, {
     *   desiredSampRate: 16 * 1000 // bits-per-sample * 1000
     * });
     */
    var desiredSampRate = config.desiredSampRate;

    // backward compatibility
    if (config.leftChannel === true) {
        numberOfAudioChannels = 1;
    }

    if (config.numberOfAudioChannels === 1) {
        numberOfAudioChannels = 1;
    }

    if (!numberOfAudioChannels || numberOfAudioChannels < 1) {
        numberOfAudioChannels = 2;
    }

    if (!config.disableLogs) {
        console.log('StereoAudioRecorder is set to record number of channels: ' + numberOfAudioChannels);
    }

    // if any Track within the MediaStream is muted or not enabled at any time, 
    // the browser will only record black frames 
    // or silence since that is the content produced by the Track
    // so we need to stopRecording as soon as any single track ends.
    if (typeof config.checkForInactiveTracks === 'undefined') {
        config.checkForInactiveTracks = true;
    }

    function isMediaStreamActive() {
        if (config.checkForInactiveTracks === false) {
            // always return "true"
            return true;
        }

        if ('active' in mediaStream) {
            if (!mediaStream.active) {
                return false;
            }
        } else if ('ended' in mediaStream) { // old hack
            if (mediaStream.ended) {
                return false;
            }
        }
        return true;
    }

    /**
     * This method records MediaStream.
     * @method
     * @memberof StereoAudioRecorder
     * @example
     * recorder.record();
     */
    this.record = function() {
        if (isMediaStreamActive() === false) {
            throw 'Please make sure MediaStream is active.';
        }

        resetVariables();

        isAudioProcessStarted = isPaused = false;
        recording = true;

        if (typeof config.timeSlice !== 'undefined') {
            looper();
        }
    };

    function mergeLeftRightBuffers(config, callback) {
        function mergeAudioBuffers(config, cb) {
            var numberOfAudioChannels = config.numberOfAudioChannels;

            // todo: "slice(0)" --- is it causes loop? Should be removed?
            var leftBuffers = config.leftBuffers.slice(0);
            var rightBuffers = config.rightBuffers.slice(0);
            var sampleRate = config.sampleRate;
            var internalInterleavedLength = config.internalInterleavedLength;
            var desiredSampRate = config.desiredSampRate;

            if (numberOfAudioChannels === 2) {
                leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength);
                rightBuffers = mergeBuffers(rightBuffers, internalInterleavedLength);

                if (desiredSampRate) {
                    leftBuffers = interpolateArray(leftBuffers, desiredSampRate, sampleRate);
                    rightBuffers = interpolateArray(rightBuffers, desiredSampRate, sampleRate);
                }
            }

            if (numberOfAudioChannels === 1) {
                leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength);

                if (desiredSampRate) {
                    leftBuffers = interpolateArray(leftBuffers, desiredSampRate, sampleRate);
                }
            }

            // set sample rate as desired sample rate
            if (desiredSampRate) {
                sampleRate = desiredSampRate;
            }

            // for changing the sampling rate, reference:
            // http://stackoverflow.com/a/28977136/552182
            function interpolateArray(data, newSampleRate, oldSampleRate) {
                var fitCount = Math.round(data.length * (newSampleRate / oldSampleRate));
                var newData = [];
                var springFactor = Number((data.length - 1) / (fitCount - 1));
                newData[0] = data[0];
                for (var i = 1; i < fitCount - 1; i++) {
                    var tmp = i * springFactor;
                    var before = Number(Math.floor(tmp)).toFixed();
                    var after = Number(Math.ceil(tmp)).toFixed();
                    var atPoint = tmp - before;
                    newData[i] = linearInterpolate(data[before], data[after], atPoint);
                }
                newData[fitCount - 1] = data[data.length - 1];
                return newData;
            }

            function linearInterpolate(before, after, atPoint) {
                return before + (after - before) * atPoint;
            }

            function mergeBuffers(channelBuffer, rLength) {
                var result = new Float64Array(rLength);
                var offset = 0;
                var lng = channelBuffer.length;

                for (var i = 0; i < lng; i++) {
                    var buffer = channelBuffer[i];
                    result.set(buffer, offset);
                    offset += buffer.length;
                }

                return result;
            }

            function interleave(leftChannel, rightChannel) {
                var length = leftChannel.length + rightChannel.length;

                var result = new Float64Array(length);

                var inputIndex = 0;

                for (var index = 0; index < length;) {
                    result[index++] = leftChannel[inputIndex];
                    result[index++] = rightChannel[inputIndex];
                    inputIndex++;
                }
                return result;
            }

            function writeUTFBytes(view, offset, string) {
                var lng = string.length;
                for (var i = 0; i < lng; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            }

            // interleave both channels together
            var interleaved;

            if (numberOfAudioChannels === 2) {
                interleaved = interleave(leftBuffers, rightBuffers);
            }

            if (numberOfAudioChannels === 1) {
                interleaved = leftBuffers;
            }

            var interleavedLength = interleaved.length;

            // create wav file
            var resultingBufferLength = 44 + interleavedLength * 2;

            var buffer = new ArrayBuffer(resultingBufferLength);

            var view = new DataView(buffer);

            // RIFF chunk descriptor/identifier 
            writeUTFBytes(view, 0, 'RIFF');

            // RIFF chunk length
            // changed "44" to "36" via #401
            view.setUint32(4, 36 + interleavedLength * 2, true);

            // RIFF type 
            writeUTFBytes(view, 8, 'WAVE');

            // format chunk identifier 
            // FMT sub-chunk
            writeUTFBytes(view, 12, 'fmt ');

            // format chunk length 
            view.setUint32(16, 16, true);

            // sample format (raw)
            view.setUint16(20, 1, true);

            // stereo (2 channels)
            view.setUint16(22, numberOfAudioChannels, true);

            // sample rate 
            view.setUint32(24, sampleRate, true);

            // byte rate (sample rate * block align)
            view.setUint32(28, sampleRate * 2, true);

            // block align (channel count * bytes per sample) 
            view.setUint16(32, numberOfAudioChannels * 2, true);

            // bits per sample 
            view.setUint16(34, 16, true);

            // data sub-chunk
            // data chunk identifier 
            writeUTFBytes(view, 36, 'data');

            // data chunk length 
            view.setUint32(40, interleavedLength * 2, true);

            // write the PCM samples
            var lng = interleavedLength;
            var index = 44;
            var volume = 1;
            for (var i = 0; i < lng; i++) {
                view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
                index += 2;
            }

            if (cb) {
                return cb({
                    buffer: buffer,
                    view: view
                });
            }

            postMessage({
                buffer: buffer,
                view: view
            });
        }

        if (config.noWorker) {
            mergeAudioBuffers(config, function(data) {
                callback(data.buffer, data.view);
            });
            return;
        }


        var webWorker = processInWebWorker(mergeAudioBuffers);

        webWorker.onmessage = function(event) {
            callback(event.data.buffer, event.data.view);

            // release memory
            URL.revokeObjectURL(webWorker.workerURL);

            // kill webworker (or Chrome will kill your page after ~25 calls)
            webWorker.terminate();
        };

        webWorker.postMessage(config);
    }

    function processInWebWorker(_function) {
        var workerURL = URL.createObjectURL(new Blob([_function.toString(),
            ';this.onmessage =  function (eee) {' + _function.name + '(eee.data);}'
        ], {
            type: 'application/javascript'
        }));

        var worker = new Worker(workerURL);
        worker.workerURL = workerURL;
        return worker;
    }

    /**
     * This method stops recording MediaStream.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof StereoAudioRecorder
     * @example
     * recorder.stop(function(blob) {
     *     video.src = URL.createObjectURL(blob);
     * });
     */
    this.stop = function(callback) {
        callback = callback || function() {};

        // stop recording
        recording = false;

        mergeLeftRightBuffers({
            desiredSampRate: desiredSampRate,
            sampleRate: sampleRate,
            numberOfAudioChannels: numberOfAudioChannels,
            internalInterleavedLength: recordingLength,
            leftBuffers: leftchannel,
            rightBuffers: numberOfAudioChannels === 1 ? [] : rightchannel,
            noWorker: config.noWorker
        }, function(buffer, view) {
            /**
             * @property {Blob} blob - The recorded blob object.
             * @memberof StereoAudioRecorder
             * @example
             * recorder.stop(function(){
             *     var blob = recorder.blob;
             * });
             */
            self.blob = new Blob([view], {
                type: 'audio/wav'
            });

            /**
             * @property {ArrayBuffer} buffer - The recorded buffer object.
             * @memberof StereoAudioRecorder
             * @example
             * recorder.stop(function(){
             *     var buffer = recorder.buffer;
             * });
             */
            self.buffer = new ArrayBuffer(view.buffer.byteLength);

            /**
             * @property {DataView} view - The recorded data-view object.
             * @memberof StereoAudioRecorder
             * @example
             * recorder.stop(function(){
             *     var view = recorder.view;
             * });
             */
            self.view = view;

            self.sampleRate = desiredSampRate || sampleRate;
            self.bufferSize = bufferSize;

            // recorded audio length
            self.length = recordingLength;

            isAudioProcessStarted = false;

            if (callback) {
                callback(self.blob);
            }
        });
    };

    if (typeof Storage === 'undefined') {
        var Storage = {
            AudioContextConstructor: null,
            AudioContext: window.AudioContext || window.webkitAudioContext
        };
    }

    if (!Storage.AudioContextConstructor) {
        Storage.AudioContextConstructor = new Storage.AudioContext();
    }

    var context = Storage.AudioContextConstructor;

    // creates an audio node from the microphone incoming stream
    var audioInput = context.createMediaStreamSource(mediaStream);

    var legalBufferValues = [0, 256, 512, 1024, 2048, 4096, 8192, 16384];

    /**
     * From the spec: This value controls how frequently the audioprocess event is
     * dispatched and how many sample-frames need to be processed each call.
     * Lower values for buffer size will result in a lower (better) latency.
     * Higher values will be necessary to avoid audio breakup and glitches
     * The size of the buffer (in sample-frames) which needs to
     * be processed each time onprocessaudio is called.
     * Legal values are (256, 512, 1024, 2048, 4096, 8192, 16384).
     * @property {number} bufferSize - Buffer-size for how frequently the audioprocess event is dispatched.
     * @memberof StereoAudioRecorder
     * @example
     * recorder = new StereoAudioRecorder(mediaStream, {
     *     bufferSize: 4096
     * });
     */

    // "0" means, let chrome decide the most accurate buffer-size for current platform.
    var bufferSize = typeof config.bufferSize === 'undefined' ? 4096 : config.bufferSize;

    if (legalBufferValues.indexOf(bufferSize) === -1) {
        if (!config.disableLogs) {
            console.log('Legal values for buffer-size are ' + JSON.stringify(legalBufferValues, null, '\t'));
        }
    }

    if (context.createJavaScriptNode) {
        jsAudioNode = context.createJavaScriptNode(bufferSize, numberOfAudioChannels, numberOfAudioChannels);
    } else if (context.createScriptProcessor) {
        jsAudioNode = context.createScriptProcessor(bufferSize, numberOfAudioChannels, numberOfAudioChannels);
    } else {
        throw 'WebAudio API has no support on this browser.';
    }

    // connect the stream to the script processor
    audioInput.connect(jsAudioNode);

    if (!config.bufferSize) {
        bufferSize = jsAudioNode.bufferSize; // device buffer-size
    }

    /**
     * The sample rate (in sample-frames per second) at which the
     * AudioContext handles audio. It is assumed that all AudioNodes
     * in the context run at this rate. In making this assumption,
     * sample-rate converters or "varispeed" processors are not supported
     * in real-time processing.
     * The sampleRate parameter describes the sample-rate of the
     * linear PCM audio data in the buffer in sample-frames per second.
     * An implementation must support sample-rates in at least
     * the range 22050 to 96000.
     * @property {number} sampleRate - Buffer-size for how frequently the audioprocess event is dispatched.
     * @memberof StereoAudioRecorder
     * @example
     * recorder = new StereoAudioRecorder(mediaStream, {
     *     sampleRate: 44100
     * });
     */
    var sampleRate = typeof config.sampleRate !== 'undefined' ? config.sampleRate : context.sampleRate || 44100;

    if (sampleRate < 22050 || sampleRate > 96000) {
        // Ref: http://stackoverflow.com/a/26303918/552182
        if (!config.disableLogs) {
            console.log('sample-rate must be under range 22050 and 96000.');
        }
    }

    if (!config.disableLogs) {
        if (config.desiredSampRate) {
            console.log('Desired sample-rate: ' + config.desiredSampRate);
        }
    }

    var isPaused = false;
    /**
     * This method pauses the recording process.
     * @method
     * @memberof StereoAudioRecorder
     * @example
     * recorder.pause();
     */
    this.pause = function() {
        isPaused = true;
    };

    /**
     * This method resumes the recording process.
     * @method
     * @memberof StereoAudioRecorder
     * @example
     * recorder.resume();
     */
    this.resume = function() {
        if (isMediaStreamActive() === false) {
            throw 'Please make sure MediaStream is active.';
        }

        if (!recording) {
            if (!config.disableLogs) {
                console.log('Seems recording has been restarted.');
            }
            this.record();
            return;
        }

        isPaused = false;
    };

    /**
     * This method resets currently recorded data.
     * @method
     * @memberof StereoAudioRecorder
     * @example
     * recorder.clearRecordedData();
     */
    this.clearRecordedData = function() {
        config.checkForInactiveTracks = false;

        if (recording) {
            this.stop(clearRecordedDataCB);
        }

        clearRecordedDataCB();
    };

    function resetVariables() {
        leftchannel = [];
        rightchannel = [];
        recordingLength = 0;
        isAudioProcessStarted = false;
        recording = false;
        isPaused = false;
        context = null;

        self.leftchannel = leftchannel;
        self.rightchannel = rightchannel;
        self.numberOfAudioChannels = numberOfAudioChannels;
        self.desiredSampRate = desiredSampRate;
        self.sampleRate = sampleRate;
        self.recordingLength = recordingLength;

        intervalsBasedBuffers = {
            left: [],
            right: [],
            recordingLength: 0
        };
    }

    function clearRecordedDataCB() {
        if (jsAudioNode) {
            jsAudioNode.onaudioprocess = null;
            jsAudioNode.disconnect();
            jsAudioNode = null;
        }

        if (audioInput) {
            audioInput.disconnect();
            audioInput = null;
        }

        resetVariables();
    }

    // for debugging
    this.name = 'StereoAudioRecorder';
    this.toString = function() {
        return this.name;
    };

    var isAudioProcessStarted = false;

    function onAudioProcessDataAvailable(e) {
        if (isPaused) {
            return;
        }

        if (isMediaStreamActive() === false) {
            if (!config.disableLogs) {
                console.log('MediaStream seems stopped.');
            }
            jsAudioNode.disconnect();
            recording = false;
        }

        if (!recording) {
            if (audioInput) {
                audioInput.disconnect();
                audioInput = null;
            }
            return;
        }

        /**
         * This method is called on "onaudioprocess" event's first invocation.
         * @method {function} onAudioProcessStarted
         * @memberof StereoAudioRecorder
         * @example
         * recorder.onAudioProcessStarted: function() { };
         */
        if (!isAudioProcessStarted) {
            isAudioProcessStarted = true;
            if (config.onAudioProcessStarted) {
                config.onAudioProcessStarted();
            }

            if (config.initCallback) {
                config.initCallback();
            }
        }

        var left = e.inputBuffer.getChannelData(0);

        // we clone the samples
        var chLeft = new Float32Array(left);
        leftchannel.push(chLeft);

        if (numberOfAudioChannels === 2) {
            var right = e.inputBuffer.getChannelData(1);
            var chRight = new Float32Array(right);
            rightchannel.push(chRight);
        }

        recordingLength += bufferSize;

        // export raw PCM
        self.recordingLength = recordingLength;

        if (typeof config.timeSlice !== 'undefined') {
            intervalsBasedBuffers.recordingLength += bufferSize;
            intervalsBasedBuffers.left.push(chLeft);

            if (numberOfAudioChannels === 2) {
                intervalsBasedBuffers.right.push(chRight);
            }
        }
    }

    jsAudioNode.onaudioprocess = onAudioProcessDataAvailable;

    // to prevent self audio to be connected with speakers
    if (context.createMediaStreamDestination) {
        jsAudioNode.connect(context.createMediaStreamDestination());
    } else {
        jsAudioNode.connect(context.destination);
    }

    // export raw PCM
    this.leftchannel = leftchannel;
    this.rightchannel = rightchannel;
    this.numberOfAudioChannels = numberOfAudioChannels;
    this.desiredSampRate = desiredSampRate;
    this.sampleRate = sampleRate;
    self.recordingLength = recordingLength;

    // helper for intervals based blobs
    var intervalsBasedBuffers = {
        left: [],
        right: [],
        recordingLength: 0
    };

    // this looper is used to support intervals based blobs (via timeSlice+ondataavailable)
    function looper() {
        if (!recording || typeof config.ondataavailable !== 'function' || typeof config.timeSlice === 'undefined') {
            return;
        }

        if (intervalsBasedBuffers.left.length) {
            mergeLeftRightBuffers({
                desiredSampRate: desiredSampRate,
                sampleRate: sampleRate,
                numberOfAudioChannels: numberOfAudioChannels,
                internalInterleavedLength: intervalsBasedBuffers.recordingLength,
                leftBuffers: intervalsBasedBuffers.left,
                rightBuffers: numberOfAudioChannels === 1 ? [] : intervalsBasedBuffers.right
            }, function(buffer, view) {
                var blob = new Blob([view], {
                    type: 'audio/wav'
                });
                config.ondataavailable(blob);

                setTimeout(looper, config.timeSlice);
            });

            intervalsBasedBuffers = {
                left: [],
                right: [],
                recordingLength: 0
            };
        } else {
            setTimeout(looper, config.timeSlice);
        }
    }
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.StereoAudioRecorder = StereoAudioRecorder;
}

// _________________
// CanvasRecorder.js

/**
 * CanvasRecorder is a standalone class used by {@link RecordRTC} to bring HTML5-Canvas recording into video WebM. It uses HTML2Canvas library and runs top over {@link Whammy}.
 * @summary HTML2Canvas recording into video WebM.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef CanvasRecorder
 * @class
 * @example
 * var recorder = new CanvasRecorder(htmlElement, { disableLogs: true, useWhammyRecorder: true });
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {HTMLElement} htmlElement - querySelector/getElementById/getElementsByTagName[0]/etc.
 * @param {object} config - {disableLogs:true, initCallback: function}
 */

function CanvasRecorder(htmlElement, config) {
    if (typeof html2canvas === 'undefined') {
        throw 'Please link: https://cdn.webrtc-experiment.com/screenshot.js';
    }

    config = config || {};
    if (!config.frameInterval) {
        config.frameInterval = 10;
    }

    // via DetectRTC.js
    var isCanvasSupportsStreamCapturing = false;
    ['captureStream', 'mozCaptureStream', 'webkitCaptureStream'].forEach(function(item) {
        if (item in document.createElement('canvas')) {
            isCanvasSupportsStreamCapturing = true;
        }
    });

    var _isChrome = (!!window.webkitRTCPeerConnection || !!window.webkitGetUserMedia) && !!window.chrome;

    var chromeVersion = 50;
    var matchArray = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    if (_isChrome && matchArray && matchArray[2]) {
        chromeVersion = parseInt(matchArray[2], 10);
    }

    if (_isChrome && chromeVersion < 52) {
        isCanvasSupportsStreamCapturing = false;
    }

    if (config.useWhammyRecorder) {
        isCanvasSupportsStreamCapturing = false;
    }

    var globalCanvas, mediaStreamRecorder;

    if (isCanvasSupportsStreamCapturing) {
        if (!config.disableLogs) {
            console.log('Your browser supports both MediRecorder API and canvas.captureStream!');
        }

        if (htmlElement instanceof HTMLCanvasElement) {
            globalCanvas = htmlElement;
        } else if (htmlElement instanceof CanvasRenderingContext2D) {
            globalCanvas = htmlElement.canvas;
        } else {
            throw 'Please pass either HTMLCanvasElement or CanvasRenderingContext2D.';
        }
    } else if (!!navigator.mozGetUserMedia) {
        if (!config.disableLogs) {
            console.error('Canvas recording is NOT supported in Firefox.');
        }
    }

    var isRecording;

    /**
     * This method records Canvas.
     * @method
     * @memberof CanvasRecorder
     * @example
     * recorder.record();
     */
    this.record = function() {
        isRecording = true;

        if (isCanvasSupportsStreamCapturing && !config.useWhammyRecorder) {
            // CanvasCaptureMediaStream
            var canvasMediaStream;
            if ('captureStream' in globalCanvas) {
                canvasMediaStream = globalCanvas.captureStream(25); // 25 FPS
            } else if ('mozCaptureStream' in globalCanvas) {
                canvasMediaStream = globalCanvas.mozCaptureStream(25);
            } else if ('webkitCaptureStream' in globalCanvas) {
                canvasMediaStream = globalCanvas.webkitCaptureStream(25);
            }

            try {
                var mdStream = new MediaStream();
                mdStream.addTrack(getTracks(canvasMediaStream, 'video')[0]);
                canvasMediaStream = mdStream;
            } catch (e) {}

            if (!canvasMediaStream) {
                throw 'captureStream API are NOT available.';
            }

            // Note: Jan 18, 2016 status is that, 
            // Firefox MediaRecorder API can't record CanvasCaptureMediaStream object.
            mediaStreamRecorder = new MediaStreamRecorder(canvasMediaStream, {
                mimeType: config.mimeType || 'video/webm'
            });
            mediaStreamRecorder.record();
        } else {
            whammy.frames = [];
            lastTime = new Date().getTime();
            drawCanvasFrame();
        }

        if (config.initCallback) {
            config.initCallback();
        }
    };

    this.getWebPImages = function(callback) {
        if (htmlElement.nodeName.toLowerCase() !== 'canvas') {
            callback();
            return;
        }

        var framesLength = whammy.frames.length;
        whammy.frames.forEach(function(frame, idx) {
            var framesRemaining = framesLength - idx;
            if (!config.disableLogs) {
                console.log(framesRemaining + '/' + framesLength + ' frames remaining');
            }

            if (config.onEncodingCallback) {
                config.onEncodingCallback(framesRemaining, framesLength);
            }

            var webp = frame.image.toDataURL('image/webp', 1);
            whammy.frames[idx].image = webp;
        });

        if (!config.disableLogs) {
            console.log('Generating WebM');
        }

        callback();
    };

    /**
     * This method stops recording Canvas.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof CanvasRecorder
     * @example
     * recorder.stop(function(blob) {
     *     video.src = URL.createObjectURL(blob);
     * });
     */
    this.stop = function(callback) {
        isRecording = false;

        var that = this;

        if (isCanvasSupportsStreamCapturing && mediaStreamRecorder) {
            mediaStreamRecorder.stop(callback);
            return;
        }

        this.getWebPImages(function() {
            /**
             * @property {Blob} blob - Recorded frames in video/webm blob.
             * @memberof CanvasRecorder
             * @example
             * recorder.stop(function() {
             *     var blob = recorder.blob;
             * });
             */
            whammy.compile(function(blob) {
                if (!config.disableLogs) {
                    console.log('Recording finished!');
                }

                that.blob = blob;

                if (that.blob.forEach) {
                    that.blob = new Blob([], {
                        type: 'video/webm'
                    });
                }

                if (callback) {
                    callback(that.blob);
                }

                whammy.frames = [];
            });
        });
    };

    var isPausedRecording = false;

    /**
     * This method pauses the recording process.
     * @method
     * @memberof CanvasRecorder
     * @example
     * recorder.pause();
     */
    this.pause = function() {
        isPausedRecording = true;

        if (mediaStreamRecorder instanceof MediaStreamRecorder) {
            mediaStreamRecorder.pause();
            return;
        }
    };

    /**
     * This method resumes the recording process.
     * @method
     * @memberof CanvasRecorder
     * @example
     * recorder.resume();
     */
    this.resume = function() {
        isPausedRecording = false;

        if (mediaStreamRecorder instanceof MediaStreamRecorder) {
            mediaStreamRecorder.resume();
            return;
        }

        if (!isRecording) {
            this.record();
        }
    };

    /**
     * This method resets currently recorded data.
     * @method
     * @memberof CanvasRecorder
     * @example
     * recorder.clearRecordedData();
     */
    this.clearRecordedData = function() {
        if (isRecording) {
            this.stop(clearRecordedDataCB);
        }
        clearRecordedDataCB();
    };

    function clearRecordedDataCB() {
        whammy.frames = [];
        isRecording = false;
        isPausedRecording = false;
    }

    // for debugging
    this.name = 'CanvasRecorder';
    this.toString = function() {
        return this.name;
    };

    function cloneCanvas() {
        //create a new canvas
        var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d');

        //set dimensions
        newCanvas.width = htmlElement.width;
        newCanvas.height = htmlElement.height;

        //apply the old canvas to the new one
        context.drawImage(htmlElement, 0, 0);

        //return the new canvas
        return newCanvas;
    }

    function drawCanvasFrame() {
        if (isPausedRecording) {
            lastTime = new Date().getTime();
            return setTimeout(drawCanvasFrame, 500);
        }

        if (htmlElement.nodeName.toLowerCase() === 'canvas') {
            var duration = new Date().getTime() - lastTime;
            // via #206, by Jack i.e. @Seymourr
            lastTime = new Date().getTime();

            whammy.frames.push({
                image: cloneCanvas(),
                duration: duration
            });

            if (isRecording) {
                setTimeout(drawCanvasFrame, config.frameInterval);
            }
            return;
        }

        html2canvas(htmlElement, {
            grabMouse: typeof config.showMousePointer === 'undefined' || config.showMousePointer,
            onrendered: function(canvas) {
                var duration = new Date().getTime() - lastTime;
                if (!duration) {
                    return setTimeout(drawCanvasFrame, config.frameInterval);
                }

                // via #206, by Jack i.e. @Seymourr
                lastTime = new Date().getTime();

                whammy.frames.push({
                    image: canvas.toDataURL('image/webp', 1),
                    duration: duration
                });

                if (isRecording) {
                    setTimeout(drawCanvasFrame, config.frameInterval);
                }
            }
        });
    }

    var lastTime = new Date().getTime();

    var whammy = new Whammy.Video(100);
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.CanvasRecorder = CanvasRecorder;
}

// _________________
// WhammyRecorder.js

/**
 * WhammyRecorder is a standalone class used by {@link RecordRTC} to bring video recording in Chrome. It runs top over {@link Whammy}.
 * @summary Video recording feature in Chrome.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef WhammyRecorder
 * @class
 * @example
 * var recorder = new WhammyRecorder(mediaStream);
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {disableLogs: true, initCallback: function, video: HTMLVideoElement, etc.}
 */

function WhammyRecorder(mediaStream, config) {

    config = config || {};

    if (!config.frameInterval) {
        config.frameInterval = 10;
    }

    if (!config.disableLogs) {
        console.log('Using frames-interval:', config.frameInterval);
    }

    /**
     * This method records video.
     * @method
     * @memberof WhammyRecorder
     * @example
     * recorder.record();
     */
    this.record = function() {
        if (!config.width) {
            config.width = 320;
        }

        if (!config.height) {
            config.height = 240;
        }

        if (!config.video) {
            config.video = {
                width: config.width,
                height: config.height
            };
        }

        if (!config.canvas) {
            config.canvas = {
                width: config.width,
                height: config.height
            };
        }

        canvas.width = config.canvas.width || 30;
        canvas.height = config.canvas.height || 240;

        context = canvas.getContext('2d');

        // setting defaults
        if (config.video && config.video instanceof HTMLVideoElement) {
            video = config.video.cloneNode();

            if (config.initCallback) {
                config.initCallback();
            }
        } else {
            video = document.createElement('video');

            setSrcObject(mediaStream, video);

            video.onloadedmetadata = function() { // "onloadedmetadata" may NOT work in FF?
                if (config.initCallback) {
                    config.initCallback();
                }
            };

            video.width = config.video.width;
            video.height = config.video.height;
        }

        video.muted = true;
        video.play();

        lastTime = new Date().getTime();
        whammy = new Whammy.Video();

        if (!config.disableLogs) {
            console.log('canvas resolutions', canvas.width, '*', canvas.height);
            console.log('video width/height', video.width || canvas.width, '*', video.height || canvas.height);
        }

        drawFrames(config.frameInterval);
    };

    /**
     * Draw and push frames to Whammy
     * @param {integer} frameInterval - set minimum interval (in milliseconds) between each time we push a frame to Whammy
     */
    function drawFrames(frameInterval) {
        frameInterval = typeof frameInterval !== 'undefined' ? frameInterval : 10;

        var duration = new Date().getTime() - lastTime;
        if (!duration) {
            return setTimeout(drawFrames, frameInterval, frameInterval);
        }

        if (isPausedRecording) {
            lastTime = new Date().getTime();
            return setTimeout(drawFrames, 100);
        }

        // via #206, by Jack i.e. @Seymourr
        lastTime = new Date().getTime();

        if (video.paused) {
            // via: https://github.com/muaz-khan/WebRTC-Experiment/pull/316
            // Tweak for Android Chrome
            video.play();
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        whammy.frames.push({
            duration: duration,
            image: canvas.toDataURL('image/webp')
        });

        if (!isStopDrawing) {
            setTimeout(drawFrames, frameInterval, frameInterval);
        }
    }

    function asyncLoop(o) {
        var i = -1,
            length = o.length;

        (function loop() {
            i++;
            if (i === length) {
                o.callback();
                return;
            }

            // "setTimeout" added by Jim McLeod
            setTimeout(function() {
                o.functionToLoop(loop, i);
            }, 1);
        })();
    }


    /**
     * remove black frames from the beginning to the specified frame
     * @param {Array} _frames - array of frames to be checked
     * @param {number} _framesToCheck - number of frame until check will be executed (-1 - will drop all frames until frame not matched will be found)
     * @param {number} _pixTolerance - 0 - very strict (only black pixel color) ; 1 - all
     * @param {number} _frameTolerance - 0 - very strict (only black frame color) ; 1 - all
     * @returns {Array} - array of frames
     */
    // pull#293 by @volodalexey
    function dropBlackFrames(_frames, _framesToCheck, _pixTolerance, _frameTolerance, callback) {
        var localCanvas = document.createElement('canvas');
        localCanvas.width = canvas.width;
        localCanvas.height = canvas.height;
        var context2d = localCanvas.getContext('2d');
        var resultFrames = [];

        var checkUntilNotBlack = _framesToCheck === -1;
        var endCheckFrame = (_framesToCheck && _framesToCheck > 0 && _framesToCheck <= _frames.length) ?
            _framesToCheck : _frames.length;
        var sampleColor = {
            r: 0,
            g: 0,
            b: 0
        };
        var maxColorDifference = Math.sqrt(
            Math.pow(255, 2) +
            Math.pow(255, 2) +
            Math.pow(255, 2)
        );
        var pixTolerance = _pixTolerance && _pixTolerance >= 0 && _pixTolerance <= 1 ? _pixTolerance : 0;
        var frameTolerance = _frameTolerance && _frameTolerance >= 0 && _frameTolerance <= 1 ? _frameTolerance : 0;
        var doNotCheckNext = false;

        asyncLoop({
            length: endCheckFrame,
            functionToLoop: function(loop, f) {
                var matchPixCount, endPixCheck, maxPixCount;

                var finishImage = function() {
                    if (!doNotCheckNext && maxPixCount - matchPixCount <= maxPixCount * frameTolerance) {
                        // console.log('removed black frame : ' + f + ' ; frame duration ' + _frames[f].duration);
                    } else {
                        // console.log('frame is passed : ' + f);
                        if (checkUntilNotBlack) {
                            doNotCheckNext = true;
                        }
                        resultFrames.push(_frames[f]);
                    }
                    loop();
                };

                if (!doNotCheckNext) {
                    var image = new Image();
                    image.onload = function() {
                        context2d.drawImage(image, 0, 0, canvas.width, canvas.height);
                        var imageData = context2d.getImageData(0, 0, canvas.width, canvas.height);
                        matchPixCount = 0;
                        endPixCheck = imageData.data.length;
                        maxPixCount = imageData.data.length / 4;

                        for (var pix = 0; pix < endPixCheck; pix += 4) {
                            var currentColor = {
                                r: imageData.data[pix],
                                g: imageData.data[pix + 1],
                                b: imageData.data[pix + 2]
                            };
                            var colorDifference = Math.sqrt(
                                Math.pow(currentColor.r - sampleColor.r, 2) +
                                Math.pow(currentColor.g - sampleColor.g, 2) +
                                Math.pow(currentColor.b - sampleColor.b, 2)
                            );
                            // difference in color it is difference in color vectors (r1,g1,b1) <=> (r2,g2,b2)
                            if (colorDifference <= maxColorDifference * pixTolerance) {
                                matchPixCount++;
                            }
                        }
                        finishImage();
                    };
                    image.src = _frames[f].image;
                } else {
                    finishImage();
                }
            },
            callback: function() {
                resultFrames = resultFrames.concat(_frames.slice(endCheckFrame));

                if (resultFrames.length <= 0) {
                    // at least one last frame should be available for next manipulation
                    // if total duration of all frames will be < 1000 than ffmpeg doesn't work well...
                    resultFrames.push(_frames[_frames.length - 1]);
                }
                callback(resultFrames);
            }
        });
    }

    var isStopDrawing = false;

    /**
     * This method stops recording video.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof WhammyRecorder
     * @example
     * recorder.stop(function(blob) {
     *     video.src = URL.createObjectURL(blob);
     * });
     */
    this.stop = function(callback) {
        callback = callback || function() {};

        isStopDrawing = true;

        var _this = this;
        // analyse of all frames takes some time!
        setTimeout(function() {
            // e.g. dropBlackFrames(frames, 10, 1, 1) - will cut all 10 frames
            // e.g. dropBlackFrames(frames, 10, 0.5, 0.5) - will analyse 10 frames
            // e.g. dropBlackFrames(frames, 10) === dropBlackFrames(frames, 10, 0, 0) - will analyse 10 frames with strict black color
            dropBlackFrames(whammy.frames, -1, null, null, function(frames) {
                whammy.frames = frames;

                // to display advertisement images!
                if (config.advertisement && config.advertisement.length) {
                    whammy.frames = config.advertisement.concat(whammy.frames);
                }

                /**
                 * @property {Blob} blob - Recorded frames in video/webm blob.
                 * @memberof WhammyRecorder
                 * @example
                 * recorder.stop(function() {
                 *     var blob = recorder.blob;
                 * });
                 */
                whammy.compile(function(blob) {
                    _this.blob = blob;

                    if (_this.blob.forEach) {
                        _this.blob = new Blob([], {
                            type: 'video/webm'
                        });
                    }

                    if (callback) {
                        callback(_this.blob);
                    }
                });
            });
        }, 10);
    };

    var isPausedRecording = false;

    /**
     * This method pauses the recording process.
     * @method
     * @memberof WhammyRecorder
     * @example
     * recorder.pause();
     */
    this.pause = function() {
        isPausedRecording = true;
    };

    /**
     * This method resumes the recording process.
     * @method
     * @memberof WhammyRecorder
     * @example
     * recorder.resume();
     */
    this.resume = function() {
        isPausedRecording = false;

        if (isStopDrawing) {
            this.record();
        }
    };

    /**
     * This method resets currently recorded data.
     * @method
     * @memberof WhammyRecorder
     * @example
     * recorder.clearRecordedData();
     */
    this.clearRecordedData = function() {
        if (!isStopDrawing) {
            this.stop(clearRecordedDataCB);
        }
        clearRecordedDataCB();
    };

    function clearRecordedDataCB() {
        whammy.frames = [];
        isStopDrawing = true;
        isPausedRecording = false;
    }

    // for debugging
    this.name = 'WhammyRecorder';
    this.toString = function() {
        return this.name;
    };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var video;
    var lastTime;
    var whammy;
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.WhammyRecorder = WhammyRecorder;
}

// https://github.com/antimatter15/whammy/blob/master/LICENSE
// _________
// Whammy.js

// todo: Firefox now supports webp for webm containers!
// their MediaRecorder implementation works well!
// should we provide an option to record via Whammy.js or MediaRecorder API is a better solution?

/**
 * Whammy is a standalone class used by {@link RecordRTC} to bring video recording in Chrome. It is written by {@link https://github.com/antimatter15|antimatter15}
 * @summary A real time javascript webm encoder based on a canvas hack.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef Whammy
 * @class
 * @example
 * var recorder = new Whammy().Video(15);
 * recorder.add(context || canvas || dataURL);
 * var output = recorder.compile();
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */

var Whammy = (function() {
    // a more abstract-ish API

    function WhammyVideo(duration) {
        this.frames = [];
        this.duration = duration || 1;
        this.quality = 0.8;
    }

    /**
     * Pass Canvas or Context or image/webp(string) to {@link Whammy} encoder.
     * @method
     * @memberof Whammy
     * @example
     * recorder = new Whammy().Video(0.8, 100);
     * recorder.add(canvas || context || 'image/webp');
     * @param {string} frame - Canvas || Context || image/webp
     * @param {number} duration - Stick a duration (in milliseconds)
     */
    WhammyVideo.prototype.add = function(frame, duration) {
        if ('canvas' in frame) { //CanvasRenderingContext2D
            frame = frame.canvas;
        }

        if ('toDataURL' in frame) {
            frame = frame.toDataURL('image/webp', this.quality);
        }

        if (!(/^data:image\/webp;base64,/ig).test(frame)) {
            throw 'Input must be formatted properly as a base64 encoded DataURI of type image/webp';
        }
        this.frames.push({
            image: frame,
            duration: duration || this.duration
        });
    };

    function processInWebWorker(_function) {
        var blob = URL.createObjectURL(new Blob([_function.toString(),
            'this.onmessage =  function (eee) {' + _function.name + '(eee.data);}'
        ], {
            type: 'application/javascript'
        }));

        var worker = new Worker(blob);
        URL.revokeObjectURL(blob);
        return worker;
    }

    function whammyInWebWorker(frames) {
        function ArrayToWebM(frames) {
            var info = checkFrames(frames);
            if (!info) {
                return [];
            }

            var clusterMaxDuration = 30000;

            var EBML = [{
                'id': 0x1a45dfa3, // EBML
                'data': [{
                    'data': 1,
                    'id': 0x4286 // EBMLVersion
                }, {
                    'data': 1,
                    'id': 0x42f7 // EBMLReadVersion
                }, {
                    'data': 4,
                    'id': 0x42f2 // EBMLMaxIDLength
                }, {
                    'data': 8,
                    'id': 0x42f3 // EBMLMaxSizeLength
                }, {
                    'data': 'webm',
                    'id': 0x4282 // DocType
                }, {
                    'data': 2,
                    'id': 0x4287 // DocTypeVersion
                }, {
                    'data': 2,
                    'id': 0x4285 // DocTypeReadVersion
                }]
            }, {
                'id': 0x18538067, // Segment
                'data': [{
                    'id': 0x1549a966, // Info
                    'data': [{
                        'data': 1e6, //do things in millisecs (num of nanosecs for duration scale)
                        'id': 0x2ad7b1 // TimecodeScale
                    }, {
                        'data': 'whammy',
                        'id': 0x4d80 // MuxingApp
                    }, {
                        'data': 'whammy',
                        'id': 0x5741 // WritingApp
                    }, {
                        'data': doubleToString(info.duration),
                        'id': 0x4489 // Duration
                    }]
                }, {
                    'id': 0x1654ae6b, // Tracks
                    'data': [{
                        'id': 0xae, // TrackEntry
                        'data': [{
                            'data': 1,
                            'id': 0xd7 // TrackNumber
                        }, {
                            'data': 1,
                            'id': 0x73c5 // TrackUID
                        }, {
                            'data': 0,
                            'id': 0x9c // FlagLacing
                        }, {
                            'data': 'und',
                            'id': 0x22b59c // Language
                        }, {
                            'data': 'V_VP8',
                            'id': 0x86 // CodecID
                        }, {
                            'data': 'VP8',
                            'id': 0x258688 // CodecName
                        }, {
                            'data': 1,
                            'id': 0x83 // TrackType
                        }, {
                            'id': 0xe0, // Video
                            'data': [{
                                'data': info.width,
                                'id': 0xb0 // PixelWidth
                            }, {
                                'data': info.height,
                                'id': 0xba // PixelHeight
                            }]
                        }]
                    }]
                }]
            }];

            //Generate clusters (max duration)
            var frameNumber = 0;
            var clusterTimecode = 0;
            while (frameNumber < frames.length) {

                var clusterFrames = [];
                var clusterDuration = 0;
                do {
                    clusterFrames.push(frames[frameNumber]);
                    clusterDuration += frames[frameNumber].duration;
                    frameNumber++;
                } while (frameNumber < frames.length && clusterDuration < clusterMaxDuration);

                var clusterCounter = 0;
                var cluster = {
                    'id': 0x1f43b675, // Cluster
                    'data': getClusterData(clusterTimecode, clusterCounter, clusterFrames)
                }; //Add cluster to segment
                EBML[1].data.push(cluster);
                clusterTimecode += clusterDuration;
            }

            return generateEBML(EBML);
        }

        function getClusterData(clusterTimecode, clusterCounter, clusterFrames) {
            return [{
                'data': clusterTimecode,
                'id': 0xe7 // Timecode
            }].concat(clusterFrames.map(function(webp) {
                var block = makeSimpleBlock({
                    discardable: 0,
                    frame: webp.data.slice(4),
                    invisible: 0,
                    keyframe: 1,
                    lacing: 0,
                    trackNum: 1,
                    timecode: Math.round(clusterCounter)
                });
                clusterCounter += webp.duration;
                return {
                    data: block,
                    id: 0xa3
                };
            }));
        }

        // sums the lengths of all the frames and gets the duration

        function checkFrames(frames) {
            if (!frames[0]) {
                postMessage({
                    error: 'Something went wrong. Maybe WebP format is not supported in the current browser.'
                });
                return;
            }

            var width = frames[0].width,
                height = frames[0].height,
                duration = frames[0].duration;

            for (var i = 1; i < frames.length; i++) {
                duration += frames[i].duration;
            }
            return {
                duration: duration,
                width: width,
                height: height
            };
        }

        function numToBuffer(num) {
            var parts = [];
            while (num > 0) {
                parts.push(num & 0xff);
                num = num >> 8;
            }
            return new Uint8Array(parts.reverse());
        }

        function strToBuffer(str) {
            return new Uint8Array(str.split('').map(function(e) {
                return e.charCodeAt(0);
            }));
        }

        function bitsToBuffer(bits) {
            var data = [];
            var pad = (bits.length % 8) ? (new Array(1 + 8 - (bits.length % 8))).join('0') : '';
            bits = pad + bits;
            for (var i = 0; i < bits.length; i += 8) {
                data.push(parseInt(bits.substr(i, 8), 2));
            }
            return new Uint8Array(data);
        }

        function generateEBML(json) {
            var ebml = [];
            for (var i = 0; i < json.length; i++) {
                var data = json[i].data;

                if (typeof data === 'object') {
                    data = generateEBML(data);
                }

                if (typeof data === 'number') {
                    data = bitsToBuffer(data.toString(2));
                }

                if (typeof data === 'string') {
                    data = strToBuffer(data);
                }

                var len = data.size || data.byteLength || data.length;
                var zeroes = Math.ceil(Math.ceil(Math.log(len) / Math.log(2)) / 8);
                var sizeToString = len.toString(2);
                var padded = (new Array((zeroes * 7 + 7 + 1) - sizeToString.length)).join('0') + sizeToString;
                var size = (new Array(zeroes)).join('0') + '1' + padded;

                ebml.push(numToBuffer(json[i].id));
                ebml.push(bitsToBuffer(size));
                ebml.push(data);
            }

            return new Blob(ebml, {
                type: 'video/webm'
            });
        }

        function toBinStrOld(bits) {
            var data = '';
            var pad = (bits.length % 8) ? (new Array(1 + 8 - (bits.length % 8))).join('0') : '';
            bits = pad + bits;
            for (var i = 0; i < bits.length; i += 8) {
                data += String.fromCharCode(parseInt(bits.substr(i, 8), 2));
            }
            return data;
        }

        function makeSimpleBlock(data) {
            var flags = 0;

            if (data.keyframe) {
                flags |= 128;
            }

            if (data.invisible) {
                flags |= 8;
            }

            if (data.lacing) {
                flags |= (data.lacing << 1);
            }

            if (data.discardable) {
                flags |= 1;
            }

            if (data.trackNum > 127) {
                throw 'TrackNumber > 127 not supported';
            }

            var out = [data.trackNum | 0x80, data.timecode >> 8, data.timecode & 0xff, flags].map(function(e) {
                return String.fromCharCode(e);
            }).join('') + data.frame;

            return out;
        }

        function parseWebP(riff) {
            var VP8 = riff.RIFF[0].WEBP[0];

            var frameStart = VP8.indexOf('\x9d\x01\x2a'); // A VP8 keyframe starts with the 0x9d012a header
            for (var i = 0, c = []; i < 4; i++) {
                c[i] = VP8.charCodeAt(frameStart + 3 + i);
            }

            var width, height, tmp;

            //the code below is literally copied verbatim from the bitstream spec
            tmp = (c[1] << 8) | c[0];
            width = tmp & 0x3FFF;
            tmp = (c[3] << 8) | c[2];
            height = tmp & 0x3FFF;
            return {
                width: width,
                height: height,
                data: VP8,
                riff: riff
            };
        }

        function getStrLength(string, offset) {
            return parseInt(string.substr(offset + 4, 4).split('').map(function(i) {
                var unpadded = i.charCodeAt(0).toString(2);
                return (new Array(8 - unpadded.length + 1)).join('0') + unpadded;
            }).join(''), 2);
        }

        function parseRIFF(string) {
            var offset = 0;
            var chunks = {};

            while (offset < string.length) {
                var id = string.substr(offset, 4);
                var len = getStrLength(string, offset);
                var data = string.substr(offset + 4 + 4, len);
                offset += 4 + 4 + len;
                chunks[id] = chunks[id] || [];

                if (id === 'RIFF' || id === 'LIST') {
                    chunks[id].push(parseRIFF(data));
                } else {
                    chunks[id].push(data);
                }
            }
            return chunks;
        }

        function doubleToString(num) {
            return [].slice.call(
                new Uint8Array((new Float64Array([num])).buffer), 0).map(function(e) {
                return String.fromCharCode(e);
            }).reverse().join('');
        }

        var webm = new ArrayToWebM(frames.map(function(frame) {
            var webp = parseWebP(parseRIFF(atob(frame.image.slice(23))));
            webp.duration = frame.duration;
            return webp;
        }));

        postMessage(webm);
    }

    /**
     * Encodes frames in WebM container. It uses WebWorkinvoke to invoke 'ArrayToWebM' method.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof Whammy
     * @example
     * recorder = new Whammy().Video(0.8, 100);
     * recorder.compile(function(blob) {
     *    // blob.size - blob.type
     * });
     */
    WhammyVideo.prototype.compile = function(callback) {
        var webWorker = processInWebWorker(whammyInWebWorker);

        webWorker.onmessage = function(event) {
            if (event.data.error) {
                console.error(event.data.error);
                return;
            }
            callback(event.data);
        };

        webWorker.postMessage(this.frames);
    };

    return {
        /**
         * A more abstract-ish API.
         * @method
         * @memberof Whammy
         * @example
         * recorder = new Whammy().Video(0.8, 100);
         * @param {?number} speed - 0.8
         * @param {?number} quality - 100
         */
        Video: WhammyVideo
    };
})();

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.Whammy = Whammy;
}

// ______________ (indexed-db)
// DiskStorage.js

/**
 * DiskStorage is a standalone object used by {@link RecordRTC} to store recorded blobs in IndexedDB storage.
 * @summary Writing blobs into IndexedDB.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @example
 * DiskStorage.Store({
 *     audioBlob: yourAudioBlob,
 *     videoBlob: yourVideoBlob,
 *     gifBlob  : yourGifBlob
 * });
 * DiskStorage.Fetch(function(dataURL, type) {
 *     if(type === 'audioBlob') { }
 *     if(type === 'videoBlob') { }
 *     if(type === 'gifBlob')   { }
 * });
 * // DiskStorage.dataStoreName = 'recordRTC';
 * // DiskStorage.onError = function(error) { };
 * @property {function} init - This method must be called once to initialize IndexedDB ObjectStore. Though, it is auto-used internally.
 * @property {function} Fetch - This method fetches stored blobs from IndexedDB.
 * @property {function} Store - This method stores blobs in IndexedDB.
 * @property {function} onError - This function is invoked for any known/unknown error.
 * @property {string} dataStoreName - Name of the ObjectStore created in IndexedDB storage.
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */


var DiskStorage = {
    /**
     * This method must be called once to initialize IndexedDB ObjectStore. Though, it is auto-used internally.
     * @method
     * @memberof DiskStorage
     * @internal
     * @example
     * DiskStorage.init();
     */
    init: function() {
        var self = this;

        if (typeof indexedDB === 'undefined' || typeof indexedDB.open === 'undefined') {
            console.error('IndexedDB API are not available in this browser.');
            return;
        }

        var dbVersion = 1;
        var dbName = this.dbName || location.href.replace(/\/|:|#|%|\.|\[|\]/g, ''),
            db;
        var request = indexedDB.open(dbName, dbVersion);

        function createObjectStore(dataBase) {
            dataBase.createObjectStore(self.dataStoreName);
        }

        function putInDB() {
            var transaction = db.transaction([self.dataStoreName], 'readwrite');

            if (self.videoBlob) {
                transaction.objectStore(self.dataStoreName).put(self.videoBlob, 'videoBlob');
            }

            if (self.gifBlob) {
                transaction.objectStore(self.dataStoreName).put(self.gifBlob, 'gifBlob');
            }

            if (self.audioBlob) {
                transaction.objectStore(self.dataStoreName).put(self.audioBlob, 'audioBlob');
            }

            function getFromStore(portionName) {
                transaction.objectStore(self.dataStoreName).get(portionName).onsuccess = function(event) {
                    if (self.callback) {
                        self.callback(event.target.result, portionName);
                    }
                };
            }

            getFromStore('audioBlob');
            getFromStore('videoBlob');
            getFromStore('gifBlob');
        }

        request.onerror = self.onError;

        request.onsuccess = function() {
            db = request.result;
            db.onerror = self.onError;

            if (db.setVersion) {
                if (db.version !== dbVersion) {
                    var setVersion = db.setVersion(dbVersion);
                    setVersion.onsuccess = function() {
                        createObjectStore(db);
                        putInDB();
                    };
                } else {
                    putInDB();
                }
            } else {
                putInDB();
            }
        };
        request.onupgradeneeded = function(event) {
            createObjectStore(event.target.result);
        };
    },
    /**
     * This method fetches stored blobs from IndexedDB.
     * @method
     * @memberof DiskStorage
     * @internal
     * @example
     * DiskStorage.Fetch(function(dataURL, type) {
     *     if(type === 'audioBlob') { }
     *     if(type === 'videoBlob') { }
     *     if(type === 'gifBlob')   { }
     * });
     */
    Fetch: function(callback) {
        this.callback = callback;
        this.init();

        return this;
    },
    /**
     * This method stores blobs in IndexedDB.
     * @method
     * @memberof DiskStorage
     * @internal
     * @example
     * DiskStorage.Store({
     *     audioBlob: yourAudioBlob,
     *     videoBlob: yourVideoBlob,
     *     gifBlob  : yourGifBlob
     * });
     */
    Store: function(config) {
        this.audioBlob = config.audioBlob;
        this.videoBlob = config.videoBlob;
        this.gifBlob = config.gifBlob;

        this.init();

        return this;
    },
    /**
     * This function is invoked for any known/unknown error.
     * @method
     * @memberof DiskStorage
     * @internal
     * @example
     * DiskStorage.onError = function(error){
     *     alerot( JSON.stringify(error) );
     * };
     */
    onError: function(error) {
        console.error(JSON.stringify(error, null, '\t'));
    },

    /**
     * @property {string} dataStoreName - Name of the ObjectStore created in IndexedDB storage.
     * @memberof DiskStorage
     * @internal
     * @example
     * DiskStorage.dataStoreName = 'recordRTC';
     */
    dataStoreName: 'recordRTC',
    dbName: null
};

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.DiskStorage = DiskStorage;
}

// ______________
// GifRecorder.js

/**
 * GifRecorder is standalone calss used by {@link RecordRTC} to record video or canvas into animated gif.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef GifRecorder
 * @class
 * @example
 * var recorder = new GifRecorder(mediaStream || canvas || context, { onGifPreview: function, onGifRecordingStarted: function, width: 1280, height: 720, frameRate: 200, quality: 10 });
 * recorder.record();
 * recorder.stop(function(blob) {
 *     img.src = URL.createObjectURL(blob);
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object or HTMLCanvasElement or CanvasRenderingContext2D.
 * @param {object} config - {disableLogs:true, initCallback: function, width: 320, height: 240, frameRate: 200, quality: 10}
 */

function GifRecorder(mediaStream, config) {
    if (typeof GIFEncoder === 'undefined') {
        var script = document.createElement('script');
        script.src = 'https://cdn.webrtc-experiment.com/gif-recorder.js';
        (document.body || document.documentElement).appendChild(script);
    }

    config = config || {};

    var isHTMLObject = mediaStream instanceof CanvasRenderingContext2D || mediaStream instanceof HTMLCanvasElement;

    /**
     * This method records MediaStream.
     * @method
     * @memberof GifRecorder
     * @example
     * recorder.record();
     */
    this.record = function() {
        if (typeof GIFEncoder === 'undefined') {
            setTimeout(self.record, 1000);
            return;
        }

        if (!isLoadedMetaData) {
            setTimeout(self.record, 1000);
            return;
        }

        if (!isHTMLObject) {
            if (!config.width) {
                config.width = video.offsetWidth || 320;
            }

            if (!config.height) {
                config.height = video.offsetHeight || 240;
            }

            if (!config.video) {
                config.video = {
                    width: config.width,
                    height: config.height
                };
            }

            if (!config.canvas) {
                config.canvas = {
                    width: config.width,
                    height: config.height
                };
            }

            canvas.width = config.canvas.width || 320;
            canvas.height = config.canvas.height || 240;

            video.width = config.video.width || 320;
            video.height = config.video.height || 240;
        }

        // external library to record as GIF images
        gifEncoder = new GIFEncoder();

        // void setRepeat(int iter) 
        // Sets the number of times the set of GIF frames should be played. 
        // Default is 1; 0 means play indefinitely.
        gifEncoder.setRepeat(0);

        // void setFrameRate(Number fps) 
        // Sets frame rate in frames per second. 
        // Equivalent to setDelay(1000/fps).
        // Using "setDelay" instead of "setFrameRate"
        gifEncoder.setDelay(config.frameRate || 200);

        // void setQuality(int quality) 
        // Sets quality of color quantization (conversion of images to the 
        // maximum 256 colors allowed by the GIF specification). 
        // Lower values (minimum = 1) produce better colors, 
        // but slow processing significantly. 10 is the default, 
        // and produces good color mapping at reasonable speeds. 
        // Values greater than 20 do not yield significant improvements in speed.
        gifEncoder.setQuality(config.quality || 10);

        // Boolean start() 
        // This writes the GIF Header and returns false if it fails.
        gifEncoder.start();

        if (typeof config.onGifRecordingStarted === 'function') {
            config.onGifRecordingStarted();
        }

        startTime = Date.now();

        function drawVideoFrame(time) {
            if (self.clearedRecordedData === true) {
                return;
            }

            if (isPausedRecording) {
                return setTimeout(function() {
                    drawVideoFrame(time);
                }, 100);
            }

            lastAnimationFrame = requestAnimationFrame(drawVideoFrame);

            if (typeof lastFrameTime === undefined) {
                lastFrameTime = time;
            }

            // ~10 fps
            if (time - lastFrameTime < 90) {
                return;
            }

            if (!isHTMLObject && video.paused) {
                // via: https://github.com/muaz-khan/WebRTC-Experiment/pull/316
                // Tweak for Android Chrome
                video.play();
            }

            if (!isHTMLObject) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
            }

            if (config.onGifPreview) {
                config.onGifPreview(canvas.toDataURL('image/png'));
            }

            gifEncoder.addFrame(context);
            lastFrameTime = time;
        }

        lastAnimationFrame = requestAnimationFrame(drawVideoFrame);

        if (config.initCallback) {
            config.initCallback();
        }
    };

    /**
     * This method stops recording MediaStream.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof GifRecorder
     * @example
     * recorder.stop(function(blob) {
     *     img.src = URL.createObjectURL(blob);
     * });
     */
    this.stop = function(callback) {
        callback = callback || function() {};

        if (lastAnimationFrame) {
            cancelAnimationFrame(lastAnimationFrame);
        }

        endTime = Date.now();

        /**
         * @property {Blob} blob - The recorded blob object.
         * @memberof GifRecorder
         * @example
         * recorder.stop(function(){
         *     var blob = recorder.blob;
         * });
         */
        this.blob = new Blob([new Uint8Array(gifEncoder.stream().bin)], {
            type: 'image/gif'
        });

        callback(this.blob);

        // bug: find a way to clear old recorded blobs
        gifEncoder.stream().bin = [];
    };

    var isPausedRecording = false;

    /**
     * This method pauses the recording process.
     * @method
     * @memberof GifRecorder
     * @example
     * recorder.pause();
     */
    this.pause = function() {
        isPausedRecording = true;
    };

    /**
     * This method resumes the recording process.
     * @method
     * @memberof GifRecorder
     * @example
     * recorder.resume();
     */
    this.resume = function() {
        isPausedRecording = false;
    };

    /**
     * This method resets currently recorded data.
     * @method
     * @memberof GifRecorder
     * @example
     * recorder.clearRecordedData();
     */
    this.clearRecordedData = function() {
        self.clearedRecordedData = true;
        clearRecordedDataCB();
    };

    function clearRecordedDataCB() {
        if (gifEncoder) {
            gifEncoder.stream().bin = [];
        }
    }

    // for debugging
    this.name = 'GifRecorder';
    this.toString = function() {
        return this.name;
    };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    if (isHTMLObject) {
        if (mediaStream instanceof CanvasRenderingContext2D) {
            context = mediaStream;
            canvas = context.canvas;
        } else if (mediaStream instanceof HTMLCanvasElement) {
            context = mediaStream.getContext('2d');
            canvas = mediaStream;
        }
    }

    var isLoadedMetaData = true;

    if (!isHTMLObject) {
        var video = document.createElement('video');
        video.muted = true;
        video.autoplay = true;

        isLoadedMetaData = false;
        video.onloadedmetadata = function() {
            isLoadedMetaData = true;
        };

        setSrcObject(mediaStream, video);

        video.play();
    }

    var lastAnimationFrame = null;
    var startTime, endTime, lastFrameTime;

    var gifEncoder;

    var self = this;
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.GifRecorder = GifRecorder;
}

// Last time updated: 2018-12-22 9:13:29 AM UTC

// ________________________
// MultiStreamsMixer v1.0.7

// Open-Sourced: https://github.com/muaz-khan/MultiStreamsMixer

// --------------------------------------------------
// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
// --------------------------------------------------

function MultiStreamsMixer(arrayOfMediaStreams) {

    // requires: chrome://flags/#enable-experimental-web-platform-features

    var videos = [];
    var isStopDrawingFrames = false;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.style = 'opacity:0;position:absolute;z-index:-1;top: -100000000;left:-1000000000; margin-top:-1000000000;margin-left:-1000000000;';
    (document.body || document.documentElement).appendChild(canvas);

    this.disableLogs = false;
    this.frameInterval = 10;

    this.width = 360;
    this.height = 240;

    // use gain node to prevent echo
    this.useGainNode = true;

    var self = this;

    // _____________________________
    // Cross-Browser-Declarations.js

    // WebAudio API representer
    var AudioContext = window.AudioContext;

    if (typeof AudioContext === 'undefined') {
        if (typeof webkitAudioContext !== 'undefined') {
            /*global AudioContext:true */
            AudioContext = webkitAudioContext;
        }

        if (typeof mozAudioContext !== 'undefined') {
            /*global AudioContext:true */
            AudioContext = mozAudioContext;
        }
    }

    /*jshint -W079 */
    var URL = window.URL;

    if (typeof URL === 'undefined' && typeof webkitURL !== 'undefined') {
        /*global URL:true */
        URL = webkitURL;
    }

    if (typeof navigator !== 'undefined' && typeof navigator.getUserMedia === 'undefined') { // maybe window.navigator?
        if (typeof navigator.webkitGetUserMedia !== 'undefined') {
            navigator.getUserMedia = navigator.webkitGetUserMedia;
        }

        if (typeof navigator.mozGetUserMedia !== 'undefined') {
            navigator.getUserMedia = navigator.mozGetUserMedia;
        }
    }

    var MediaStream = window.MediaStream;

    if (typeof MediaStream === 'undefined' && typeof webkitMediaStream !== 'undefined') {
        MediaStream = webkitMediaStream;
    }

    /*global MediaStream:true */
    if (typeof MediaStream !== 'undefined') {
        // override "stop" method for all browsers
        if (typeof MediaStream.prototype.stop === 'undefined') {
            MediaStream.prototype.stop = function() {
                this.getTracks().forEach(function(track) {
                    track.stop();
                });
            };
        }
    }

    var Storage = {};

    if (typeof AudioContext !== 'undefined') {
        Storage.AudioContext = AudioContext;
    } else if (typeof webkitAudioContext !== 'undefined') {
        Storage.AudioContext = webkitAudioContext;
    }

    function setSrcObject(stream, element) {
        if ('srcObject' in element) {
            element.srcObject = stream;
        } else if ('mozSrcObject' in element) {
            element.mozSrcObject = stream;
        } else {
            element.srcObject = stream;
        }
    }

    this.startDrawingFrames = function() {
        drawVideosToCanvas();
    };

    function drawVideosToCanvas() {
        if (isStopDrawingFrames) {
            return;
        }

        var videosLength = videos.length;

        var fullcanvas = false;
        var remaining = [];
        videos.forEach(function(video) {
            if (!video.stream) {
                video.stream = {};
            }

            if (video.stream.fullcanvas) {
                fullcanvas = video;
            } else {
                remaining.push(video);
            }
        });

        if (fullcanvas) {
            canvas.width = fullcanvas.stream.width;
            canvas.height = fullcanvas.stream.height;
        } else if (remaining.length) {
            canvas.width = videosLength > 1 ? remaining[0].width * 2 : remaining[0].width;

            var height = 1;
            if (videosLength === 3 || videosLength === 4) {
                height = 2;
            }
            if (videosLength === 5 || videosLength === 6) {
                height = 3;
            }
            if (videosLength === 7 || videosLength === 8) {
                height = 4;
            }
            if (videosLength === 9 || videosLength === 10) {
                height = 5;
            }
            canvas.height = remaining[0].height * height;
        } else {
            canvas.width = self.width || 360;
            canvas.height = self.height || 240;
        }

        if (fullcanvas && fullcanvas instanceof HTMLVideoElement) {
            drawImage(fullcanvas);
        }

        remaining.forEach(function(video, idx) {
            drawImage(video, idx);
        });

        setTimeout(drawVideosToCanvas, self.frameInterval);
    }

    function drawImage(video, idx) {
        if (isStopDrawingFrames) {
            return;
        }

        var x = 0;
        var y = 0;
        var width = video.width;
        var height = video.height;

        if (idx === 1) {
            x = video.width;
        }

        if (idx === 2) {
            y = video.height;
        }

        if (idx === 3) {
            x = video.width;
            y = video.height;
        }

        if (idx === 4) {
            y = video.height * 2;
        }

        if (idx === 5) {
            x = video.width;
            y = video.height * 2;
        }

        if (idx === 6) {
            y = video.height * 3;
        }

        if (idx === 7) {
            x = video.width;
            y = video.height * 3;
        }

        if (typeof video.stream.left !== 'undefined') {
            x = video.stream.left;
        }

        if (typeof video.stream.top !== 'undefined') {
            y = video.stream.top;
        }

        if (typeof video.stream.width !== 'undefined') {
            width = video.stream.width;
        }

        if (typeof video.stream.height !== 'undefined') {
            height = video.stream.height;
        }

        context.drawImage(video, x, y, width, height);

        if (typeof video.stream.onRender === 'function') {
            video.stream.onRender(context, x, y, width, height, idx);
        }
    }

    function getMixedStream() {
        isStopDrawingFrames = false;
        var mixedVideoStream = getMixedVideoStream();

        var mixedAudioStream = getMixedAudioStream();
        if (mixedAudioStream) {
            mixedAudioStream.getTracks().filter(function(t) {
                return t.kind === 'audio';
            }).forEach(function(track) {
                mixedVideoStream.addTrack(track);
            });
        }

        var fullcanvas;
        arrayOfMediaStreams.forEach(function(stream) {
            if (stream.fullcanvas) {
                fullcanvas = true;
            }
        });

        return mixedVideoStream;
    }

    function getMixedVideoStream() {
        resetVideoStreams();

        var capturedStream;

        if ('captureStream' in canvas) {
            capturedStream = canvas.captureStream();
        } else if ('mozCaptureStream' in canvas) {
            capturedStream = canvas.mozCaptureStream();
        } else if (!self.disableLogs) {
            console.error('Upgrade to latest Chrome or otherwise enable this flag: chrome://flags/#enable-experimental-web-platform-features');
        }

        var videoStream = new MediaStream();

        capturedStream.getTracks().filter(function(t) {
            return t.kind === 'video';
        }).forEach(function(track) {
            videoStream.addTrack(track);
        });

        canvas.stream = videoStream;

        return videoStream;
    }

    function getMixedAudioStream() {
        // via: @pehrsons
        if (!Storage.AudioContextConstructor) {
            Storage.AudioContextConstructor = new Storage.AudioContext();
        }

        self.audioContext = Storage.AudioContextConstructor;

        self.audioSources = [];

        if (self.useGainNode === true) {
            self.gainNode = self.audioContext.createGain();
            self.gainNode.connect(self.audioContext.destination);
            self.gainNode.gain.value = 0; // don't hear self
        }

        var audioTracksLength = 0;
        arrayOfMediaStreams.forEach(function(stream) {
            if (!stream.getTracks().filter(function(t) {
                    return t.kind === 'audio';
                }).length) {
                return;
            }

            audioTracksLength++;

            var audioSource = self.audioContext.createMediaStreamSource(stream);

            if (self.useGainNode === true) {
                audioSource.connect(self.gainNode);
            }

            self.audioSources.push(audioSource);
        });

        if (!audioTracksLength) {
            return;
        }

        self.audioDestination = self.audioContext.createMediaStreamDestination();
        self.audioSources.forEach(function(audioSource) {
            audioSource.connect(self.audioDestination);
        });
        return self.audioDestination.stream;
    }

    function getVideo(stream) {
        var video = document.createElement('video');

        setSrcObject(stream, video);

        video.muted = true;
        video.volume = 0;

        video.width = stream.width || self.width || 360;
        video.height = stream.height || self.height || 240;

        video.play();

        return video;
    }

    this.appendStreams = function(streams) {
        if (!streams) {
            throw 'First parameter is required.';
        }

        if (!(streams instanceof Array)) {
            streams = [streams];
        }

        arrayOfMediaStreams.concat(streams);

        streams.forEach(function(stream) {
            if (stream.getTracks().filter(function(t) {
                    return t.kind === 'video';
                }).length) {
                var video = getVideo(stream);
                video.stream = stream;
                videos.push(video);
            }

            if (stream.getTracks().filter(function(t) {
                    return t.kind === 'audio';
                }).length && self.audioContext) {
                var audioSource = self.audioContext.createMediaStreamSource(stream);
                audioSource.connect(self.audioDestination);
                self.audioSources.push(audioSource);
            }
        });
    };

    this.releaseStreams = function() {
        videos = [];
        isStopDrawingFrames = true;

        if (self.gainNode) {
            self.gainNode.disconnect();
            self.gainNode = null;
        }

        if (self.audioSources.length) {
            self.audioSources.forEach(function(source) {
                source.disconnect();
            });
            self.audioSources = [];
        }

        if (self.audioDestination) {
            self.audioDestination.disconnect();
            self.audioDestination = null;
        }

        if (self.audioContext) {
            self.audioContext.close();
        }

        self.audioContext = null;

        context.clearRect(0, 0, canvas.width, canvas.height);

        if (canvas.stream) {
            canvas.stream.stop();
            canvas.stream = null;
        }
    };

    this.resetVideoStreams = function(streams) {
        if (streams && !(streams instanceof Array)) {
            streams = [streams];
        }

        resetVideoStreams(streams);
    };

    function resetVideoStreams(streams) {
        videos = [];
        streams = streams || arrayOfMediaStreams;

        // via: @adrian-ber
        streams.forEach(function(stream) {
            if (!stream.getTracks().filter(function(t) {
                    return t.kind === 'video';
                }).length) {
                return;
            }

            var video = getVideo(stream);
            video.stream = stream;
            videos.push(video);
        });
    }

    // for debugging
    this.name = 'MultiStreamsMixer';
    this.toString = function() {
        return this.name;
    };

    this.getMixedStream = getMixedStream;

}

// ______________________
// MultiStreamRecorder.js

/*
 * Video conference recording, using captureStream API along with WebAudio and Canvas2D API.
 */

/**
 * MultiStreamRecorder can record multiple videos in single container.
 * @summary Multi-videos recorder.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef MultiStreamRecorder
 * @class
 * @example
 * var options = {
 *     mimeType: 'video/webm'
 * }
 * var recorder = new MultiStreamRecorder(ArrayOfMediaStreams, options);
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 *
 *     // or
 *     var blob = recorder.blob;
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStreams} mediaStreams - Array of MediaStreams.
 * @param {object} config - {disableLogs:true, frameInterval: 1, mimeType: "video/webm"}
 */

function MultiStreamRecorder(arrayOfMediaStreams, options) {
    arrayOfMediaStreams = arrayOfMediaStreams || [];
    var self = this;

    var mixer;
    var mediaRecorder;

    options = options || {
        mimeType: 'video/webm',
        video: {
            width: 360,
            height: 240
        }
    };

    if (!options.frameInterval) {
        options.frameInterval = 10;
    }

    if (!options.video) {
        options.video = {};
    }

    if (!options.video.width) {
        options.video.width = 360;
    }

    if (!options.video.height) {
        options.video.height = 240;
    }

    /**
     * This method records all MediaStreams.
     * @method
     * @memberof MultiStreamRecorder
     * @example
     * recorder.record();
     */
    this.record = function() {
        // github/muaz-khan/MultiStreamsMixer
        mixer = new MultiStreamsMixer(arrayOfMediaStreams);

        if (getAllVideoTracks().length) {
            mixer.frameInterval = options.frameInterval || 10;
            mixer.width = options.video.width || 360;
            mixer.height = options.video.height || 240;
            mixer.startDrawingFrames();
        }

        if (options.previewStream && typeof options.previewStream === 'function') {
            options.previewStream(mixer.getMixedStream());
        }

        // record using MediaRecorder API
        mediaRecorder = new MediaStreamRecorder(mixer.getMixedStream(), options);
        mediaRecorder.record();
    };

    function getAllVideoTracks() {
        var tracks = [];
        arrayOfMediaStreams.forEach(function(stream) {
            getTracks(stream, 'video').forEach(function(track) {
                tracks.push(track);
            });
        });
        return tracks;
    }

    /**
     * This method stops recording MediaStream.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof MultiStreamRecorder
     * @example
     * recorder.stop(function(blob) {
     *     video.src = URL.createObjectURL(blob);
     * });
     */
    this.stop = function(callback) {
        if (!mediaRecorder) {
            return;
        }

        mediaRecorder.stop(function(blob) {
            self.blob = blob;

            callback(blob);

            self.clearRecordedData();
        });
    };

    /**
     * This method pauses the recording process.
     * @method
     * @memberof MultiStreamRecorder
     * @example
     * recorder.pause();
     */
    this.pause = function() {
        if (mediaRecorder) {
            mediaRecorder.pause();
        }
    };

    /**
     * This method resumes the recording process.
     * @method
     * @memberof MultiStreamRecorder
     * @example
     * recorder.resume();
     */
    this.resume = function() {
        if (mediaRecorder) {
            mediaRecorder.resume();
        }
    };

    /**
     * This method resets currently recorded data.
     * @method
     * @memberof MultiStreamRecorder
     * @example
     * recorder.clearRecordedData();
     */
    this.clearRecordedData = function() {
        if (mediaRecorder) {
            mediaRecorder.clearRecordedData();
            mediaRecorder = null;
        }

        if (mixer) {
            mixer.releaseStreams();
            mixer = null;
        }
    };

    /**
     * Add extra media-streams to existing recordings.
     * @method
     * @memberof MultiStreamRecorder
     * @param {MediaStreams} mediaStreams - Array of MediaStreams
     * @example
     * recorder.addStreams([newAudioStream, newVideoStream]);
     */
    this.addStreams = function(streams) {
        if (!streams) {
            throw 'First parameter is required.';
        }

        if (!(streams instanceof Array)) {
            streams = [streams];
        }

        arrayOfMediaStreams.concat(streams);

        if (!mediaRecorder || !mixer) {
            return;
        }

        mixer.appendStreams(streams);
    };

    /**
     * Reset videos during live recording. Replace old videos e.g. replace cameras with full-screen.
     * @method
     * @memberof MultiStreamRecorder
     * @param {MediaStreams} mediaStreams - Array of MediaStreams
     * @example
     * recorder.resetVideoStreams([newVideo1, newVideo2]);
     */
    this.resetVideoStreams = function(streams) {
        if (!mixer) {
            return;
        }

        if (streams && !(streams instanceof Array)) {
            streams = [streams];
        }

        mixer.resetVideoStreams(streams);
    };

    // for debugging
    this.name = 'MultiStreamRecorder';
    this.toString = function() {
        return this.name;
    };
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.MultiStreamRecorder = MultiStreamRecorder;
}

// _____________________
// RecordRTC.promises.js

/**
 * RecordRTCPromisesHandler adds promises support in {@link RecordRTC}. Try a {@link https://github.com/muaz-khan/RecordRTC/blob/master/simple-demos/RecordRTCPromisesHandler.html|demo here}
 * @summary Promises for {@link RecordRTC}
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef RecordRTCPromisesHandler
 * @class
 * @example
 * var recorder = new RecordRTCPromisesHandler(mediaStream, options);
 * recorder.startRecording()
 *         .then(successCB)
 *         .catch(errorCB);
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - Single media-stream object, array of media-streams, html-canvas-element, etc.
 * @param {object} config - {type:"video", recorderType: MediaStreamRecorder, disableLogs: true, numberOfAudioChannels: 1, bufferSize: 0, sampleRate: 0, video: HTMLVideoElement, etc.}
 * @throws Will throw an error if "new" keyword is not used to initiate "RecordRTCPromisesHandler". Also throws error if first argument "MediaStream" is missing.
 * @requires {@link RecordRTC}
 */

function RecordRTCPromisesHandler(mediaStream, options) {
    if (!this) {
        throw 'Use "new RecordRTCPromisesHandler()"';
    }

    if (typeof mediaStream === 'undefined') {
        throw 'First argument "MediaStream" is required.';
    }

    var self = this;

    /**
     * @property {Blob} blob - Access/reach the native {@link RecordRTC} object.
     * @memberof RecordRTCPromisesHandler
     * @example
     * var internal = recorder.recordRTC.getInternalRecorder();
     * alert(internal instanceof MediaStreamRecorder);
     */
    self.recordRTC = new RecordRTC(mediaStream, options);

    /**
     * This method records MediaStream.
     * @method
     * @memberof RecordRTCPromisesHandler
     * @example
     * recorder.startRecording()
     *         .then(successCB)
     *         .catch(errorCB);
     */
    this.startRecording = function() {
        return new Promise(function(resolve, reject) {
            try {
                self.recordRTC.startRecording();
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    };

    /**
     * This method stops the recording.
     * @method
     * @memberof RecordRTCPromisesHandler
     * @example
     * recorder.stopRecording().then(function() {
     *     var blob = recorder.getBlob();
     * }).catch(errorCB);
     */
    this.stopRecording = function() {
        return new Promise(function(resolve, reject) {
            try {
                self.recordRTC.stopRecording(function(url) {
                    self.blob = self.recordRTC.getBlob();

                    if (!self.blob || !self.blob.size) {
                        reject('Empty blob.', self.blob);
                        return;
                    }

                    resolve(url);
                });
            } catch (e) {
                reject(e);
            }
        });
    };

    /**
     * This method returns data-url for the recorded blob.
     * @method
     * @memberof RecordRTCPromisesHandler
     * @example
     * recorder.stopRecording().then(function() {
     *     recorder.getDataURL().then(function(dataURL) {
     *         window.open(dataURL);
     *     }).catch(errorCB);;
     * }).catch(errorCB);
     */
    this.getDataURL = function(callback) {
        return new Promise(function(resolve, reject) {
            try {
                self.recordRTC.getDataURL(function(dataURL) {
                    resolve(dataURL);
                });
            } catch (e) {
                reject(e);
            }
        });
    };

    /**
     * This method returns the recorded blob.
     * @method
     * @memberof RecordRTCPromisesHandler
     * @example
     * recorder.stopRecording().then(function() {
     *     recorder.getBlob().then(function(blob) {})
     * }).catch(errorCB);
     */
    this.getBlob = function() {
        return new Promise(function(resolve, reject) {
            try {
                resolve(self.recordRTC.getBlob());
            } catch (e) {
                reject(e);
            }
        });
    };

    /**
     * @property {Blob} blob - Recorded data as "Blob" object.
     * @memberof RecordRTCPromisesHandler
     * @example
     * recorder.stopRecording().then(function() {
     *     var blob = recorder.getBlob();
     * }).catch(errorCB);
     */
    this.blob = null;
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.RecordRTCPromisesHandler = RecordRTCPromisesHandler;
}

// ______________________
// WebAssemblyRecorder.js

/**
 * WebAssemblyRecorder lets you create webm videos in JavaScript via WebAssembly. The library consumes raw RGBA32 buffers (4 bytes per pixel) and turns them into a webm video with the given framerate and quality. This makes it compatible out-of-the-box with ImageData from a CANVAS. With realtime mode you can also use webm-wasm for streaming webm videos.
 * @summary Video recording feature in Chrome, Firefox and maybe Edge.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef WebAssemblyRecorder
 * @class
 * @example
 * var recorder = new WebAssemblyRecorder(mediaStream);
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {webAssemblyPath:'webm-wasm.wasm',workerPath: 'webm-worker.js', frameRate: 30, width: 1920, height: 1080, bitrate: 1024}
 */
function WebAssemblyRecorder(stream, config) {
    // based on: github.com/GoogleChromeLabs/webm-wasm

    if (typeof ReadableStream === 'undefined' || typeof WritableStream === 'undefined') {
        // because it fixes readable/writable streams issues
        console.error('Following polyfill is strongly recommended: https://unpkg.com/@mattiasbuelens/web-streams-polyfill/dist/polyfill.min.js');
    }

    config = config || {};

    config.width = config.width || 640;
    config.height = config.height || 480;
    config.frameRate = config.frameRate || 30;
    config.bitrate = config.bitrate || 1200;

    function createBufferURL(buffer, type) {
        return URL.createObjectURL(new Blob([buffer], {
            type: type || ''
        }));
    }

    function cameraStream() {
        return new ReadableStream({
            start: function(controller) {
                var cvs = document.createElement('canvas');
                var video = document.createElement('video');
                video.srcObject = stream;
                video.onplaying = function() {
                    cvs.width = config.width;
                    cvs.height = config.height;
                    var ctx = cvs.getContext('2d');
                    var frameTimeout = 1000 / config.frameRate;
                    setTimeout(function f() {
                        ctx.drawImage(video, 0, 0);
                        controller.enqueue(
                            ctx.getImageData(0, 0, config.width, config.height)
                        );
                        setTimeout(f, frameTimeout);
                    }, frameTimeout);
                };
                video.play();
            }
        });
    }

    var worker;

    function startRecording(stream, buffer) {
        if (!config.workerPath && !buffer) {
            // is it safe to use @latest ?
            fetch(
                'https://unpkg.com/webm-wasm@latest/dist/webm-worker.js'
            ).then(function(r) {
                r.arrayBuffer().then(function(buffer) {
                    startRecording(stream, buffer);
                });
            });
            return;
        }

        if (!config.workerPath && buffer instanceof ArrayBuffer) {
            var blob = new Blob([buffer], {
                type: 'text/javascript'
            });
            config.workerPath = URL.createObjectURL(blob);
        }

        if (!config.workerPath) {
            console.error('workerPath parameter is missing.');
        }

        worker = new Worker(config.workerPath);

        worker.postMessage(config.webAssemblyPath || 'https://unpkg.com/webm-wasm@latest/dist/webm-wasm.wasm');
        worker.addEventListener('message', function(event) {
            if (event.data === 'READY') {
                worker.postMessage({
                    width: config.width,
                    height: config.height,
                    bitrate: config.bitrate || 1200,
                    timebaseDen: config.frameRate || 30,
                    realtime: true
                });

                cameraStream().pipeTo(new WritableStream({
                    write: function(image) {
                        if (!worker) {
                            return;
                        }

                        worker.postMessage(image.data.buffer, [image.data.buffer]);
                    }
                }));
            } else if (!!event.data) {
                if (!isPaused) {
                    arrayOfBuffers.push(event.data);
                }
            }
        });
    }

    /**
     * This method records video.
     * @method
     * @memberof WebAssemblyRecorder
     * @example
     * recorder.record();
     */
    this.record = function() {
        arrayOfBuffers = [];
        isPaused = false;
        this.blob = null;
        startRecording(stream);

        if (typeof config.initCallback === 'function') {
            config.initCallback();
        }
    };

    var isPaused;

    /**
     * This method pauses the recording process.
     * @method
     * @memberof WebAssemblyRecorder
     * @example
     * recorder.pause();
     */
    this.pause = function() {
        isPaused = true;
    };

    /**
     * This method resumes the recording process.
     * @method
     * @memberof WebAssemblyRecorder
     * @example
     * recorder.resume();
     */
    this.resume = function() {
        isPaused = false;
    };

    function terminate() {
        if (!worker) {
            return;
        }

        worker.postMessage(null);
        worker.terminate();
        worker = null;
    }

    var arrayOfBuffers = [];

    /**
     * This method stops recording video.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof WebAssemblyRecorder
     * @example
     * recorder.stop(function(blob) {
     *     video.src = URL.createObjectURL(blob);
     * });
     */
    this.stop = function(callback) {
        terminate();

        this.blob = new Blob(arrayOfBuffers, {
            type: 'video/webm'
        });

        callback(this.blob);
    };

    // for debugging
    this.name = 'WebAssemblyRecorder';
    this.toString = function() {
        return this.name;
    };

    /**
     * This method resets currently recorded data.
     * @method
     * @memberof WebAssemblyRecorder
     * @example
     * recorder.clearRecordedData();
     */
    this.clearRecordedData = function() {
        arrayOfBuffers = [];
        isPaused = false;
        this.blob = null;

        // todo: if recording-ON then STOP it first
    };

    /**
     * @property {Blob} blob - The recorded blob object.
     * @memberof WebAssemblyRecorder
     * @example
     * recorder.stop(function(){
     *     var blob = recorder.blob;
     * });
     */
    this.blob = null;
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.WebAssemblyRecorder = WebAssemblyRecorder;
}


(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.adapter = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    
    'use strict';
    
    var _adapter_factory = require('./adapter_factory.js');
    
    var adapter = (0, _adapter_factory.adapterFactory)({ window: window });
    module.exports = adapter; // this is the difference from adapter_core.
    
    },{"./adapter_factory.js":2}],2:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.adapterFactory = adapterFactory;
    
    var _utils = require('./utils');
    
    var utils = _interopRequireWildcard(_utils);
    
    var _chrome_shim = require('./chrome/chrome_shim');
    
    var chromeShim = _interopRequireWildcard(_chrome_shim);
    
    var _edge_shim = require('./edge/edge_shim');
    
    var edgeShim = _interopRequireWildcard(_edge_shim);
    
    var _firefox_shim = require('./firefox/firefox_shim');
    
    var firefoxShim = _interopRequireWildcard(_firefox_shim);
    
    var _safari_shim = require('./safari/safari_shim');
    
    var safariShim = _interopRequireWildcard(_safari_shim);
    
    var _common_shim = require('./common_shim');
    
    var commonShim = _interopRequireWildcard(_common_shim);
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    // Shimming starts here.
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    function adapterFactory() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          window = _ref.window;
    
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        shimChrome: true,
        shimFirefox: true,
        shimEdge: true,
        shimSafari: true
      };
    
      // Utils.
      var logging = utils.log;
      var browserDetails = utils.detectBrowser(window);
    
      var adapter = {
        browserDetails: browserDetails,
        commonShim: commonShim,
        extractVersion: utils.extractVersion,
        disableLog: utils.disableLog,
        disableWarnings: utils.disableWarnings
      };
    
      // Shim browser if found.
      switch (browserDetails.browser) {
        case 'chrome':
          if (!chromeShim || !chromeShim.shimPeerConnection || !options.shimChrome) {
            logging('Chrome shim is not included in this adapter release.');
            return adapter;
          }
          logging('adapter.js shimming chrome.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = chromeShim;
    
          chromeShim.shimGetUserMedia(window);
          chromeShim.shimMediaStream(window);
          chromeShim.shimPeerConnection(window);
          chromeShim.shimOnTrack(window);
          chromeShim.shimAddTrackRemoveTrack(window);
          chromeShim.shimGetSendersWithDtmf(window);
          chromeShim.shimGetStats(window);
          chromeShim.shimSenderReceiverGetStats(window);
          chromeShim.fixNegotiationNeeded(window);
    
          commonShim.shimRTCIceCandidate(window);
          commonShim.shimConnectionState(window);
          commonShim.shimMaxMessageSize(window);
          commonShim.shimSendThrowTypeError(window);
          commonShim.removeAllowExtmapMixed(window);
          break;
        case 'firefox':
          if (!firefoxShim || !firefoxShim.shimPeerConnection || !options.shimFirefox) {
            logging('Firefox shim is not included in this adapter release.');
            return adapter;
          }
          logging('adapter.js shimming firefox.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = firefoxShim;
    
          firefoxShim.shimGetUserMedia(window);
          firefoxShim.shimPeerConnection(window);
          firefoxShim.shimOnTrack(window);
          firefoxShim.shimRemoveStream(window);
          firefoxShim.shimSenderGetStats(window);
          firefoxShim.shimReceiverGetStats(window);
          firefoxShim.shimRTCDataChannel(window);
    
          commonShim.shimRTCIceCandidate(window);
          commonShim.shimConnectionState(window);
          commonShim.shimMaxMessageSize(window);
          commonShim.shimSendThrowTypeError(window);
          break;
        case 'edge':
          if (!edgeShim || !edgeShim.shimPeerConnection || !options.shimEdge) {
            logging('MS edge shim is not included in this adapter release.');
            return adapter;
          }
          logging('adapter.js shimming edge.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = edgeShim;
    
          edgeShim.shimGetUserMedia(window);
          edgeShim.shimGetDisplayMedia(window);
          edgeShim.shimPeerConnection(window);
          edgeShim.shimReplaceTrack(window);
    
          // the edge shim implements the full RTCIceCandidate object.
    
          commonShim.shimMaxMessageSize(window);
          commonShim.shimSendThrowTypeError(window);
          break;
        case 'safari':
          if (!safariShim || !options.shimSafari) {
            logging('Safari shim is not included in this adapter release.');
            return adapter;
          }
          logging('adapter.js shimming safari.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = safariShim;
    
          safariShim.shimRTCIceServerUrls(window);
          safariShim.shimCreateOfferLegacy(window);
          safariShim.shimCallbacksAPI(window);
          safariShim.shimLocalStreamsAPI(window);
          safariShim.shimRemoteStreamsAPI(window);
          safariShim.shimTrackEventTransceiver(window);
          safariShim.shimGetUserMedia(window);
    
          commonShim.shimRTCIceCandidate(window);
          commonShim.shimMaxMessageSize(window);
          commonShim.shimSendThrowTypeError(window);
          commonShim.removeAllowExtmapMixed(window);
          break;
        default:
          logging('Unsupported browser!');
          break;
      }
    
      return adapter;
    }
    
    // Browser shims.
    
    },{"./chrome/chrome_shim":3,"./common_shim":6,"./edge/edge_shim":7,"./firefox/firefox_shim":11,"./safari/safari_shim":14,"./utils":15}],3:[function(require,module,exports){
    
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    var _getusermedia = require('./getusermedia');
    
    Object.defineProperty(exports, 'shimGetUserMedia', {
      enumerable: true,
      get: function get() {
        return _getusermedia.shimGetUserMedia;
      }
    });
    
    var _getdisplaymedia = require('./getdisplaymedia');
    
    Object.defineProperty(exports, 'shimGetDisplayMedia', {
      enumerable: true,
      get: function get() {
        return _getdisplaymedia.shimGetDisplayMedia;
      }
    });
    exports.shimMediaStream = shimMediaStream;
    exports.shimOnTrack = shimOnTrack;
    exports.shimGetSendersWithDtmf = shimGetSendersWithDtmf;
    exports.shimGetStats = shimGetStats;
    exports.shimSenderReceiverGetStats = shimSenderReceiverGetStats;
    exports.shimAddTrackRemoveTrackWithNative = shimAddTrackRemoveTrackWithNative;
    exports.shimAddTrackRemoveTrack = shimAddTrackRemoveTrack;
    exports.shimPeerConnection = shimPeerConnection;
    exports.fixNegotiationNeeded = fixNegotiationNeeded;
    
    var _utils = require('../utils.js');
    
    var utils = _interopRequireWildcard(_utils);
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    function shimMediaStream(window) {
      window.MediaStream = window.MediaStream || window.webkitMediaStream;
    }
    
    function shimOnTrack(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('ontrack' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
          get: function get() {
            return this._ontrack;
          },
          set: function set(f) {
            if (this._ontrack) {
              this.removeEventListener('track', this._ontrack);
            }
            this.addEventListener('track', this._ontrack = f);
          },
    
          enumerable: true,
          configurable: true
        });
        var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription = function () {
          var _this = this;
    
          if (!this._ontrackpoly) {
            this._ontrackpoly = function (e) {
              // onaddstream does not fire when a track is added to an existing
              // stream. But stream.onaddtrack is implemented so we use that.
              e.stream.addEventListener('addtrack', function (te) {
                var receiver = void 0;
                if (window.RTCPeerConnection.prototype.getReceivers) {
                  receiver = _this.getReceivers().find(function (r) {
                    return r.track && r.track.id === te.track.id;
                  });
                } else {
                  receiver = { track: te.track };
                }
    
                var event = new Event('track');
                event.track = te.track;
                event.receiver = receiver;
                event.transceiver = { receiver: receiver };
                event.streams = [e.stream];
                _this.dispatchEvent(event);
              });
              e.stream.getTracks().forEach(function (track) {
                var receiver = void 0;
                if (window.RTCPeerConnection.prototype.getReceivers) {
                  receiver = _this.getReceivers().find(function (r) {
                    return r.track && r.track.id === track.id;
                  });
                } else {
                  receiver = { track: track };
                }
                var event = new Event('track');
                event.track = track;
                event.receiver = receiver;
                event.transceiver = { receiver: receiver };
                event.streams = [e.stream];
                _this.dispatchEvent(event);
              });
            };
            this.addEventListener('addstream', this._ontrackpoly);
          }
          return origSetRemoteDescription.apply(this, arguments);
        };
      } else {
        // even if RTCRtpTransceiver is in window, it is only used and
        // emitted in unified-plan. Unfortunately this means we need
        // to unconditionally wrap the event.
        utils.wrapPeerConnectionEvent(window, 'track', function (e) {
          if (!e.transceiver) {
            Object.defineProperty(e, 'transceiver', { value: { receiver: e.receiver } });
          }
          return e;
        });
      }
    }
    
    function shimGetSendersWithDtmf(window) {
      // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('getSenders' in window.RTCPeerConnection.prototype) && 'createDTMFSender' in window.RTCPeerConnection.prototype) {
        var shimSenderWithDtmf = function shimSenderWithDtmf(pc, track) {
          return {
            track: track,
            get dtmf() {
              if (this._dtmf === undefined) {
                if (track.kind === 'audio') {
                  this._dtmf = pc.createDTMFSender(track);
                } else {
                  this._dtmf = null;
                }
              }
              return this._dtmf;
            },
            _pc: pc
          };
        };
    
        // augment addTrack when getSenders is not available.
        if (!window.RTCPeerConnection.prototype.getSenders) {
          window.RTCPeerConnection.prototype.getSenders = function () {
            this._senders = this._senders || [];
            return this._senders.slice(); // return a copy of the internal state.
          };
          var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
          window.RTCPeerConnection.prototype.addTrack = function (track, stream) {
            var sender = origAddTrack.apply(this, arguments);
            if (!sender) {
              sender = shimSenderWithDtmf(this, track);
              this._senders.push(sender);
            }
            return sender;
          };
    
          var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
          window.RTCPeerConnection.prototype.removeTrack = function (sender) {
            origRemoveTrack.apply(this, arguments);
            var idx = this._senders.indexOf(sender);
            if (idx !== -1) {
              this._senders.splice(idx, 1);
            }
          };
        }
        var origAddStream = window.RTCPeerConnection.prototype.addStream;
        window.RTCPeerConnection.prototype.addStream = function (stream) {
          var _this2 = this;
    
          this._senders = this._senders || [];
          origAddStream.apply(this, [stream]);
          stream.getTracks().forEach(function (track) {
            _this2._senders.push(shimSenderWithDtmf(_this2, track));
          });
        };
    
        var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
        window.RTCPeerConnection.prototype.removeStream = function (stream) {
          var _this3 = this;
    
          this._senders = this._senders || [];
          origRemoveStream.apply(this, [stream]);
    
          stream.getTracks().forEach(function (track) {
            var sender = _this3._senders.find(function (s) {
              return s.track === track;
            });
            if (sender) {
              // remove sender
              _this3._senders.splice(_this3._senders.indexOf(sender), 1);
            }
          });
        };
      } else if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && 'getSenders' in window.RTCPeerConnection.prototype && 'createDTMFSender' in window.RTCPeerConnection.prototype && window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
        var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        window.RTCPeerConnection.prototype.getSenders = function () {
          var _this4 = this;
    
          var senders = origGetSenders.apply(this, []);
          senders.forEach(function (sender) {
            return sender._pc = _this4;
          });
          return senders;
        };
    
        Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
          get: function get() {
            if (this._dtmf === undefined) {
              if (this.track.kind === 'audio') {
                this._dtmf = this._pc.createDTMFSender(this.track);
              } else {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          }
        });
      }
    }
    
    function shimGetStats(window) {
      if (!window.RTCPeerConnection) {
        return;
      }
    
      var origGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function (selector, successCallback, errorCallback) {
        var _this5 = this;
    
        var args = arguments;
    
        // If selector is a function then we are in the old style stats so just
        // pass back the original getStats format to avoid breaking old users.
        if (arguments.length > 0 && typeof selector === 'function') {
          return origGetStats.apply(this, arguments);
        }
    
        // When spec-style getStats is supported, return those when called with
        // either no arguments or the selector argument is null.
        if (origGetStats.length === 0 && (arguments.length === 0 || typeof arguments[0] !== 'function')) {
          return origGetStats.apply(this, []);
        }
    
        var fixChromeStats_ = function fixChromeStats_(response) {
          var standardReport = {};
          var reports = response.result();
          reports.forEach(function (report) {
            var standardStats = {
              id: report.id,
              timestamp: report.timestamp,
              type: {
                localcandidate: 'local-candidate',
                remotecandidate: 'remote-candidate'
              }[report.type] || report.type
            };
            report.names().forEach(function (name) {
              standardStats[name] = report.stat(name);
            });
            standardReport[standardStats.id] = standardStats;
          });
    
          return standardReport;
        };
    
        // shim getStats with maplike support
        var makeMapStats = function makeMapStats(stats) {
          return new Map(Object.keys(stats).map(function (key) {
            return [key, stats[key]];
          }));
        };
    
        if (arguments.length >= 2) {
          var successCallbackWrapper_ = function successCallbackWrapper_(response) {
            args[1](makeMapStats(fixChromeStats_(response)));
          };
    
          return origGetStats.apply(this, [successCallbackWrapper_, arguments[0]]);
        }
    
        // promise-support
        return new Promise(function (resolve, reject) {
          origGetStats.apply(_this5, [function (response) {
            resolve(makeMapStats(fixChromeStats_(response)));
          }, reject]);
        }).then(successCallback, errorCallback);
      };
    }
    
    function shimSenderReceiverGetStats(window) {
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender && window.RTCRtpReceiver)) {
        return;
      }
    
      // shim sender stats.
      if (!('getStats' in window.RTCRtpSender.prototype)) {
        var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        if (origGetSenders) {
          window.RTCPeerConnection.prototype.getSenders = function () {
            var _this6 = this;
    
            var senders = origGetSenders.apply(this, []);
            senders.forEach(function (sender) {
              return sender._pc = _this6;
            });
            return senders;
          };
        }
    
        var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
        if (origAddTrack) {
          window.RTCPeerConnection.prototype.addTrack = function () {
            var sender = origAddTrack.apply(this, arguments);
            sender._pc = this;
            return sender;
          };
        }
        window.RTCRtpSender.prototype.getStats = function () {
          var sender = this;
          return this._pc.getStats().then(function (result) {
            return (
              /* Note: this will include stats of all senders that
               *   send a track with the same id as sender.track as
               *   it is not possible to identify the RTCRtpSender.
               */
              utils.filterStats(result, sender.track, true)
            );
          });
        };
      }
    
      // shim receiver stats.
      if (!('getStats' in window.RTCRtpReceiver.prototype)) {
        var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
        if (origGetReceivers) {
          window.RTCPeerConnection.prototype.getReceivers = function () {
            var _this7 = this;
    
            var receivers = origGetReceivers.apply(this, []);
            receivers.forEach(function (receiver) {
              return receiver._pc = _this7;
            });
            return receivers;
          };
        }
        utils.wrapPeerConnectionEvent(window, 'track', function (e) {
          e.receiver._pc = e.srcElement;
          return e;
        });
        window.RTCRtpReceiver.prototype.getStats = function () {
          var receiver = this;
          return this._pc.getStats().then(function (result) {
            return utils.filterStats(result, receiver.track, false);
          });
        };
      }
    
      if (!('getStats' in window.RTCRtpSender.prototype && 'getStats' in window.RTCRtpReceiver.prototype)) {
        return;
      }
    
      // shim RTCPeerConnection.getStats(track).
      var origGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function () {
        if (arguments.length > 0 && arguments[0] instanceof window.MediaStreamTrack) {
          var track = arguments[0];
          var sender = void 0;
          var receiver = void 0;
          var err = void 0;
          this.getSenders().forEach(function (s) {
            if (s.track === track) {
              if (sender) {
                err = true;
              } else {
                sender = s;
              }
            }
          });
          this.getReceivers().forEach(function (r) {
            if (r.track === track) {
              if (receiver) {
                err = true;
              } else {
                receiver = r;
              }
            }
            return r.track === track;
          });
          if (err || sender && receiver) {
            return Promise.reject(new DOMException('There are more than one sender or receiver for the track.', 'InvalidAccessError'));
          } else if (sender) {
            return sender.getStats();
          } else if (receiver) {
            return receiver.getStats();
          }
          return Promise.reject(new DOMException('There is no sender or receiver for the track.', 'InvalidAccessError'));
        }
        return origGetStats.apply(this, arguments);
      };
    }
    
    function shimAddTrackRemoveTrackWithNative(window) {
      // shim addTrack/removeTrack with native variants in order to make
      // the interactions with legacy getLocalStreams behave as in other browsers.
      // Keeps a mapping stream.id => [stream, rtpsenders...]
      window.RTCPeerConnection.prototype.getLocalStreams = function () {
        var _this8 = this;
    
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        return Object.keys(this._shimmedLocalStreams).map(function (streamId) {
          return _this8._shimmedLocalStreams[streamId][0];
        });
      };
    
      var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addTrack = function (track, stream) {
        if (!stream) {
          return origAddTrack.apply(this, arguments);
        }
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    
        var sender = origAddTrack.apply(this, arguments);
        if (!this._shimmedLocalStreams[stream.id]) {
          this._shimmedLocalStreams[stream.id] = [stream, sender];
        } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
          this._shimmedLocalStreams[stream.id].push(sender);
        }
        return sender;
      };
    
      var origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function (stream) {
        var _this9 = this;
    
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    
        stream.getTracks().forEach(function (track) {
          var alreadyExists = _this9.getSenders().find(function (s) {
            return s.track === track;
          });
          if (alreadyExists) {
            throw new DOMException('Track already exists.', 'InvalidAccessError');
          }
        });
        var existingSenders = this.getSenders();
        origAddStream.apply(this, arguments);
        var newSenders = this.getSenders().filter(function (newSender) {
          return existingSenders.indexOf(newSender) === -1;
        });
        this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
      };
    
      var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream = function (stream) {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        delete this._shimmedLocalStreams[stream.id];
        return origRemoveStream.apply(this, arguments);
      };
    
      var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
      window.RTCPeerConnection.prototype.removeTrack = function (sender) {
        var _this10 = this;
    
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        if (sender) {
          Object.keys(this._shimmedLocalStreams).forEach(function (streamId) {
            var idx = _this10._shimmedLocalStreams[streamId].indexOf(sender);
            if (idx !== -1) {
              _this10._shimmedLocalStreams[streamId].splice(idx, 1);
            }
            if (_this10._shimmedLocalStreams[streamId].length === 1) {
              delete _this10._shimmedLocalStreams[streamId];
            }
          });
        }
        return origRemoveTrack.apply(this, arguments);
      };
    }
    
    function shimAddTrackRemoveTrack(window) {
      if (!window.RTCPeerConnection) {
        return;
      }
      var browserDetails = utils.detectBrowser(window);
      // shim addTrack and removeTrack.
      if (window.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) {
        return shimAddTrackRemoveTrackWithNative(window);
      }
    
      // also shim pc.getLocalStreams when addTrack is shimmed
      // to return the original streams.
      var origGetLocalStreams = window.RTCPeerConnection.prototype.getLocalStreams;
      window.RTCPeerConnection.prototype.getLocalStreams = function () {
        var _this11 = this;
    
        var nativeStreams = origGetLocalStreams.apply(this);
        this._reverseStreams = this._reverseStreams || {};
        return nativeStreams.map(function (stream) {
          return _this11._reverseStreams[stream.id];
        });
      };
    
      var origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function (stream) {
        var _this12 = this;
    
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
    
        stream.getTracks().forEach(function (track) {
          var alreadyExists = _this12.getSenders().find(function (s) {
            return s.track === track;
          });
          if (alreadyExists) {
            throw new DOMException('Track already exists.', 'InvalidAccessError');
          }
        });
        // Add identity mapping for consistency with addTrack.
        // Unless this is being used with a stream from addTrack.
        if (!this._reverseStreams[stream.id]) {
          var newStream = new window.MediaStream(stream.getTracks());
          this._streams[stream.id] = newStream;
          this._reverseStreams[newStream.id] = stream;
          stream = newStream;
        }
        origAddStream.apply(this, [stream]);
      };
    
      var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream = function (stream) {
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
    
        origRemoveStream.apply(this, [this._streams[stream.id] || stream]);
        delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
        delete this._streams[stream.id];
      };
    
      window.RTCPeerConnection.prototype.addTrack = function (track, stream) {
        var _this13 = this;
    
        if (this.signalingState === 'closed') {
          throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
        }
        var streams = [].slice.call(arguments, 1);
        if (streams.length !== 1 || !streams[0].getTracks().find(function (t) {
          return t === track;
        })) {
          // this is not fully correct but all we can manage without
          // [[associated MediaStreams]] internal slot.
          throw new DOMException('The adapter.js addTrack polyfill only supports a single ' + ' stream which is associated with the specified track.', 'NotSupportedError');
        }
    
        var alreadyExists = this.getSenders().find(function (s) {
          return s.track === track;
        });
        if (alreadyExists) {
          throw new DOMException('Track already exists.', 'InvalidAccessError');
        }
    
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        var oldStream = this._streams[stream.id];
        if (oldStream) {
          // this is using odd Chrome behaviour, use with caution:
          // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
          // Note: we rely on the high-level addTrack/dtmf shim to
          // create the sender with a dtmf sender.
          oldStream.addTrack(track);
    
          // Trigger ONN async.
          Promise.resolve().then(function () {
            _this13.dispatchEvent(new Event('negotiationneeded'));
          });
        } else {
          var newStream = new window.MediaStream([track]);
          this._streams[stream.id] = newStream;
          this._reverseStreams[newStream.id] = stream;
          this.addStream(newStream);
        }
        return this.getSenders().find(function (s) {
          return s.track === track;
        });
      };
    
      // replace the internal stream id with the external one and
      // vice versa.
      function replaceInternalStreamId(pc, description) {
        var sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach(function (internalId) {
          var externalStream = pc._reverseStreams[internalId];
          var internalStream = pc._streams[externalStream.id];
          sdp = sdp.replace(new RegExp(internalStream.id, 'g'), externalStream.id);
        });
        return new RTCSessionDescription({
          type: description.type,
          sdp: sdp
        });
      }
      function replaceExternalStreamId(pc, description) {
        var sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach(function (internalId) {
          var externalStream = pc._reverseStreams[internalId];
          var internalStream = pc._streams[externalStream.id];
          sdp = sdp.replace(new RegExp(externalStream.id, 'g'), internalStream.id);
        });
        return new RTCSessionDescription({
          type: description.type,
          sdp: sdp
        });
      }
      ['createOffer', 'createAnswer'].forEach(function (method) {
        var nativeMethod = window.RTCPeerConnection.prototype[method];
        window.RTCPeerConnection.prototype[method] = function () {
          var _this14 = this;
    
          var args = arguments;
          var isLegacyCall = arguments.length && typeof arguments[0] === 'function';
          if (isLegacyCall) {
            return nativeMethod.apply(this, [function (description) {
              var desc = replaceInternalStreamId(_this14, description);
              args[0].apply(null, [desc]);
            }, function (err) {
              if (args[1]) {
                args[1].apply(null, err);
              }
            }, arguments[2]]);
          }
          return nativeMethod.apply(this, arguments).then(function (description) {
            return replaceInternalStreamId(_this14, description);
          });
        };
      });
    
      var origSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
      window.RTCPeerConnection.prototype.setLocalDescription = function () {
        if (!arguments.length || !arguments[0].type) {
          return origSetLocalDescription.apply(this, arguments);
        }
        arguments[0] = replaceExternalStreamId(this, arguments[0]);
        return origSetLocalDescription.apply(this, arguments);
      };
    
      // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier
    
      var origLocalDescription = Object.getOwnPropertyDescriptor(window.RTCPeerConnection.prototype, 'localDescription');
      Object.defineProperty(window.RTCPeerConnection.prototype, 'localDescription', {
        get: function get() {
          var description = origLocalDescription.get.apply(this);
          if (description.type === '') {
            return description;
          }
          return replaceInternalStreamId(this, description);
        }
      });
    
      window.RTCPeerConnection.prototype.removeTrack = function (sender) {
        var _this15 = this;
    
        if (this.signalingState === 'closed') {
          throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
        }
        // We can not yet check for sender instanceof RTCRtpSender
        // since we shim RTPSender. So we check if sender._pc is set.
        if (!sender._pc) {
          throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' + 'does not implement interface RTCRtpSender.', 'TypeError');
        }
        var isLocal = sender._pc === this;
        if (!isLocal) {
          throw new DOMException('Sender was not created by this connection.', 'InvalidAccessError');
        }
    
        // Search for the native stream the senders track belongs to.
        this._streams = this._streams || {};
        var stream = void 0;
        Object.keys(this._streams).forEach(function (streamid) {
          var hasTrack = _this15._streams[streamid].getTracks().find(function (track) {
            return sender.track === track;
          });
          if (hasTrack) {
            stream = _this15._streams[streamid];
          }
        });
    
        if (stream) {
          if (stream.getTracks().length === 1) {
            // if this is the last track of the stream, remove the stream. This
            // takes care of any shimmed _senders.
            this.removeStream(this._reverseStreams[stream.id]);
          } else {
            // relying on the same odd chrome behaviour as above.
            stream.removeTrack(sender.track);
          }
          this.dispatchEvent(new Event('negotiationneeded'));
        }
      };
    }
    
    function shimPeerConnection(window) {
      if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
        // very basic support for old versions.
        window.RTCPeerConnection = window.webkitRTCPeerConnection;
      }
      if (!window.RTCPeerConnection) {
        return;
      }
    
      // shim implicit creation of RTCSessionDescription/RTCIceCandidate
      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
        var nativeMethod = window.RTCPeerConnection.prototype[method];
        window.RTCPeerConnection.prototype[method] = function () {
          arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
          return nativeMethod.apply(this, arguments);
        };
      });
    
      // support for addIceCandidate(null or undefined)
      var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
      window.RTCPeerConnection.prototype.addIceCandidate = function () {
        if (!arguments[0]) {
          if (arguments[1]) {
            arguments[1].apply(null);
          }
          return Promise.resolve();
        }
        return nativeAddIceCandidate.apply(this, arguments);
      };
    }
    
    function fixNegotiationNeeded(window) {
      utils.wrapPeerConnectionEvent(window, 'negotiationneeded', function (e) {
        var pc = e.target;
        if (pc.signalingState !== 'stable') {
          return;
        }
        return e;
      });
    }
    
    },{"../utils.js":15,"./getdisplaymedia":4,"./getusermedia":5}],4:[function(require,module,exports){
    /*
     *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetDisplayMedia = shimGetDisplayMedia;
    function shimGetDisplayMedia(window, getSourceId) {
      if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
        return;
      }
      if (!window.navigator.mediaDevices) {
        return;
      }
      // getSourceId is a function that returns a promise resolving with
      // the sourceId of the screen/window/tab to be shared.
      if (typeof getSourceId !== 'function') {
        console.error('shimGetDisplayMedia: getSourceId argument is not ' + 'a function');
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia = function (constraints) {
        return getSourceId(constraints).then(function (sourceId) {
          var widthSpecified = constraints.video && constraints.video.width;
          var heightSpecified = constraints.video && constraints.video.height;
          var frameRateSpecified = constraints.video && constraints.video.frameRate;
          constraints.video = {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sourceId,
              maxFrameRate: frameRateSpecified || 3
            }
          };
          if (widthSpecified) {
            constraints.video.mandatory.maxWidth = widthSpecified;
          }
          if (heightSpecified) {
            constraints.video.mandatory.maxHeight = heightSpecified;
          }
          return window.navigator.mediaDevices.getUserMedia(constraints);
        });
      };
    }
    
    },{}],5:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    exports.shimGetUserMedia = shimGetUserMedia;
    
    var _utils = require('../utils.js');
    
    var utils = _interopRequireWildcard(_utils);
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    var logging = utils.log;
    
    function shimGetUserMedia(window) {
      var navigator = window && window.navigator;
    
      if (!navigator.mediaDevices) {
        return;
      }
    
      var browserDetails = utils.detectBrowser(window);
    
      var constraintsToChrome_ = function constraintsToChrome_(c) {
        if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) !== 'object' || c.mandatory || c.optional) {
          return c;
        }
        var cc = {};
        Object.keys(c).forEach(function (key) {
          if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
            return;
          }
          var r = _typeof(c[key]) === 'object' ? c[key] : { ideal: c[key] };
          if (r.exact !== undefined && typeof r.exact === 'number') {
            r.min = r.max = r.exact;
          }
          var oldname_ = function oldname_(prefix, name) {
            if (prefix) {
              return prefix + name.charAt(0).toUpperCase() + name.slice(1);
            }
            return name === 'deviceId' ? 'sourceId' : name;
          };
          if (r.ideal !== undefined) {
            cc.optional = cc.optional || [];
            var oc = {};
            if (typeof r.ideal === 'number') {
              oc[oldname_('min', key)] = r.ideal;
              cc.optional.push(oc);
              oc = {};
              oc[oldname_('max', key)] = r.ideal;
              cc.optional.push(oc);
            } else {
              oc[oldname_('', key)] = r.ideal;
              cc.optional.push(oc);
            }
          }
          if (r.exact !== undefined && typeof r.exact !== 'number') {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_('', key)] = r.exact;
          } else {
            ['min', 'max'].forEach(function (mix) {
              if (r[mix] !== undefined) {
                cc.mandatory = cc.mandatory || {};
                cc.mandatory[oldname_(mix, key)] = r[mix];
              }
            });
          }
        });
        if (c.advanced) {
          cc.optional = (cc.optional || []).concat(c.advanced);
        }
        return cc;
      };
    
      var shimConstraints_ = function shimConstraints_(constraints, func) {
        if (browserDetails.version >= 61) {
          return func(constraints);
        }
        constraints = JSON.parse(JSON.stringify(constraints));
        if (constraints && _typeof(constraints.audio) === 'object') {
          var remap = function remap(obj, a, b) {
            if (a in obj && !(b in obj)) {
              obj[b] = obj[a];
              delete obj[a];
            }
          };
          constraints = JSON.parse(JSON.stringify(constraints));
          remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
          remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
          constraints.audio = constraintsToChrome_(constraints.audio);
        }
        if (constraints && _typeof(constraints.video) === 'object') {
          // Shim facingMode for mobile & surface pro.
          var face = constraints.video.facingMode;
          face = face && ((typeof face === 'undefined' ? 'undefined' : _typeof(face)) === 'object' ? face : { ideal: face });
          var getSupportedFacingModeLies = browserDetails.version < 66;
    
          if (face && (face.exact === 'user' || face.exact === 'environment' || face.ideal === 'user' || face.ideal === 'environment') && !(navigator.mediaDevices.getSupportedConstraints && navigator.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
            delete constraints.video.facingMode;
            var matches = void 0;
            if (face.exact === 'environment' || face.ideal === 'environment') {
              matches = ['back', 'rear'];
            } else if (face.exact === 'user' || face.ideal === 'user') {
              matches = ['front'];
            }
            if (matches) {
              // Look for matches in label, or use last cam for back (typical).
              return navigator.mediaDevices.enumerateDevices().then(function (devices) {
                devices = devices.filter(function (d) {
                  return d.kind === 'videoinput';
                });
                var dev = devices.find(function (d) {
                  return matches.some(function (match) {
                    return d.label.toLowerCase().includes(match);
                  });
                });
                if (!dev && devices.length && matches.includes('back')) {
                  dev = devices[devices.length - 1]; // more likely the back cam
                }
                if (dev) {
                  constraints.video.deviceId = face.exact ? { exact: dev.deviceId } : { ideal: dev.deviceId };
                }
                constraints.video = constraintsToChrome_(constraints.video);
                logging('chrome: ' + JSON.stringify(constraints));
                return func(constraints);
              });
            }
          }
          constraints.video = constraintsToChrome_(constraints.video);
        }
        logging('chrome: ' + JSON.stringify(constraints));
        return func(constraints);
      };
    
      var shimError_ = function shimError_(e) {
        if (browserDetails.version >= 64) {
          return e;
        }
        return {
          name: {
            PermissionDeniedError: 'NotAllowedError',
            PermissionDismissedError: 'NotAllowedError',
            InvalidStateError: 'NotAllowedError',
            DevicesNotFoundError: 'NotFoundError',
            ConstraintNotSatisfiedError: 'OverconstrainedError',
            TrackStartError: 'NotReadableError',
            MediaDeviceFailedDueToShutdown: 'NotAllowedError',
            MediaDeviceKillSwitchOn: 'NotAllowedError',
            TabCaptureError: 'AbortError',
            ScreenCaptureError: 'AbortError',
            DeviceCaptureError: 'AbortError'
          }[e.name] || e.name,
          message: e.message,
          constraint: e.constraint || e.constraintName,
          toString: function toString() {
            return this.name + (this.message && ': ') + this.message;
          }
        };
      };
    
      var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
        shimConstraints_(constraints, function (c) {
          navigator.webkitGetUserMedia(c, onSuccess, function (e) {
            if (onError) {
              onError(shimError_(e));
            }
          });
        });
      };
      navigator.getUserMedia = getUserMedia_.bind(navigator);
    
      // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
      // function which returns a Promise, it does not accept spec-style
      // constraints.
      if (navigator.mediaDevices.getUserMedia) {
        var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function (cs) {
          return shimConstraints_(cs, function (c) {
            return origGetUserMedia(c).then(function (stream) {
              if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
                stream.getTracks().forEach(function (track) {
                  track.stop();
                });
                throw new DOMException('', 'NotFoundError');
              }
              return stream;
            }, function (e) {
              return Promise.reject(shimError_(e));
            });
          });
        };
      }
    }
    
    },{"../utils.js":15}],6:[function(require,module,exports){
    /*
     *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    exports.shimRTCIceCandidate = shimRTCIceCandidate;
    exports.shimMaxMessageSize = shimMaxMessageSize;
    exports.shimSendThrowTypeError = shimSendThrowTypeError;
    exports.shimConnectionState = shimConnectionState;
    exports.removeAllowExtmapMixed = removeAllowExtmapMixed;
    
    var _sdp = require('sdp');
    
    var _sdp2 = _interopRequireDefault(_sdp);
    
    var _utils = require('./utils');
    
    var utils = _interopRequireWildcard(_utils);
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function shimRTCIceCandidate(window) {
      // foundation is arbitrarily chosen as an indicator for full support for
      // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
      if (!window.RTCIceCandidate || window.RTCIceCandidate && 'foundation' in window.RTCIceCandidate.prototype) {
        return;
      }
    
      var NativeRTCIceCandidate = window.RTCIceCandidate;
      window.RTCIceCandidate = function (args) {
        // Remove the a= which shouldn't be part of the candidate string.
        if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object' && args.candidate && args.candidate.indexOf('a=') === 0) {
          args = JSON.parse(JSON.stringify(args));
          args.candidate = args.candidate.substr(2);
        }
    
        if (args.candidate && args.candidate.length) {
          // Augment the native candidate with the parsed fields.
          var nativeCandidate = new NativeRTCIceCandidate(args);
          var parsedCandidate = _sdp2.default.parseCandidate(args.candidate);
          var augmentedCandidate = Object.assign(nativeCandidate, parsedCandidate);
    
          // Add a serializer that does not serialize the extra attributes.
          augmentedCandidate.toJSON = function () {
            return {
              candidate: augmentedCandidate.candidate,
              sdpMid: augmentedCandidate.sdpMid,
              sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
              usernameFragment: augmentedCandidate.usernameFragment
            };
          };
          return augmentedCandidate;
        }
        return new NativeRTCIceCandidate(args);
      };
      window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;
    
      // Hook up the augmented candidate in onicecandidate and
      // addEventListener('icecandidate', ...)
      utils.wrapPeerConnectionEvent(window, 'icecandidate', function (e) {
        if (e.candidate) {
          Object.defineProperty(e, 'candidate', {
            value: new window.RTCIceCandidate(e.candidate),
            writable: 'false'
          });
        }
        return e;
      });
    }
    
    function shimMaxMessageSize(window) {
      if (window.RTCSctpTransport || !window.RTCPeerConnection) {
        return;
      }
      var browserDetails = utils.detectBrowser(window);
    
      if (!('sctp' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
          get: function get() {
            return typeof this._sctp === 'undefined' ? null : this._sctp;
          }
        });
      }
    
      var sctpInDescription = function sctpInDescription(description) {
        if (!description || !description.sdp) {
          return false;
        }
        var sections = _sdp2.default.splitSections(description.sdp);
        sections.shift();
        return sections.some(function (mediaSection) {
          var mLine = _sdp2.default.parseMLine(mediaSection);
          return mLine && mLine.kind === 'application' && mLine.protocol.indexOf('SCTP') !== -1;
        });
      };
    
      var getRemoteFirefoxVersion = function getRemoteFirefoxVersion(description) {
        // TODO: Is there a better solution for detecting Firefox?
        var match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
        if (match === null || match.length < 2) {
          return -1;
        }
        var version = parseInt(match[1], 10);
        // Test for NaN (yes, this is ugly)
        return version !== version ? -1 : version;
      };
    
      var getCanSendMaxMessageSize = function getCanSendMaxMessageSize(remoteIsFirefox) {
        // Every implementation we know can send at least 64 KiB.
        // Note: Although Chrome is technically able to send up to 256 KiB, the
        //       data does not reach the other peer reliably.
        //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
        var canSendMaxMessageSize = 65536;
        if (browserDetails.browser === 'firefox') {
          if (browserDetails.version < 57) {
            if (remoteIsFirefox === -1) {
              // FF < 57 will send in 16 KiB chunks using the deprecated PPID
              // fragmentation.
              canSendMaxMessageSize = 16384;
            } else {
              // However, other FF (and RAWRTC) can reassemble PPID-fragmented
              // messages. Thus, supporting ~2 GiB when sending.
              canSendMaxMessageSize = 2147483637;
            }
          } else if (browserDetails.version < 60) {
            // Currently, all FF >= 57 will reset the remote maximum message size
            // to the default value when a data channel is created at a later
            // stage. :(
            // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
            canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
          } else {
            // FF >= 60 supports sending ~2 GiB
            canSendMaxMessageSize = 2147483637;
          }
        }
        return canSendMaxMessageSize;
      };
    
      var getMaxMessageSize = function getMaxMessageSize(description, remoteIsFirefox) {
        // Note: 65536 bytes is the default value from the SDP spec. Also,
        //       every implementation we know supports receiving 65536 bytes.
        var maxMessageSize = 65536;
    
        // FF 57 has a slightly incorrect default remote max message size, so
        // we need to adjust it here to avoid a failure when sending.
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
        if (browserDetails.browser === 'firefox' && browserDetails.version === 57) {
          maxMessageSize = 65535;
        }
    
        var match = _sdp2.default.matchPrefix(description.sdp, 'a=max-message-size:');
        if (match.length > 0) {
          maxMessageSize = parseInt(match[0].substr(19), 10);
        } else if (browserDetails.browser === 'firefox' && remoteIsFirefox !== -1) {
          // If the maximum message size is not present in the remote SDP and
          // both local and remote are Firefox, the remote peer can receive
          // ~2 GiB.
          maxMessageSize = 2147483637;
        }
        return maxMessageSize;
      };
    
      var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription = function () {
        this._sctp = null;
    
        if (sctpInDescription(arguments[0])) {
          // Check if the remote is FF.
          var isFirefox = getRemoteFirefoxVersion(arguments[0]);
    
          // Get the maximum message size the local peer is capable of sending
          var canSendMMS = getCanSendMaxMessageSize(isFirefox);
    
          // Get the maximum message size of the remote peer.
          var remoteMMS = getMaxMessageSize(arguments[0], isFirefox);
    
          // Determine final maximum message size
          var maxMessageSize = void 0;
          if (canSendMMS === 0 && remoteMMS === 0) {
            maxMessageSize = Number.POSITIVE_INFINITY;
          } else if (canSendMMS === 0 || remoteMMS === 0) {
            maxMessageSize = Math.max(canSendMMS, remoteMMS);
          } else {
            maxMessageSize = Math.min(canSendMMS, remoteMMS);
          }
    
          // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
          // attribute.
          var sctp = {};
          Object.defineProperty(sctp, 'maxMessageSize', {
            get: function get() {
              return maxMessageSize;
            }
          });
          this._sctp = sctp;
        }
    
        return origSetRemoteDescription.apply(this, arguments);
      };
    }
    
    function shimSendThrowTypeError(window) {
      if (!(window.RTCPeerConnection && 'createDataChannel' in window.RTCPeerConnection.prototype)) {
        return;
      }
    
      // Note: Although Firefox >= 57 has a native implementation, the maximum
      //       message size can be reset for all data channels at a later stage.
      //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
    
      function wrapDcSend(dc, pc) {
        var origDataChannelSend = dc.send;
        dc.send = function () {
          var data = arguments[0];
          var length = data.length || data.size || data.byteLength;
          if (dc.readyState === 'open' && pc.sctp && length > pc.sctp.maxMessageSize) {
            throw new TypeError('Message too large (can send a maximum of ' + pc.sctp.maxMessageSize + ' bytes)');
          }
          return origDataChannelSend.apply(dc, arguments);
        };
      }
      var origCreateDataChannel = window.RTCPeerConnection.prototype.createDataChannel;
      window.RTCPeerConnection.prototype.createDataChannel = function () {
        var dataChannel = origCreateDataChannel.apply(this, arguments);
        wrapDcSend(dataChannel, this);
        return dataChannel;
      };
      utils.wrapPeerConnectionEvent(window, 'datachannel', function (e) {
        wrapDcSend(e.channel, e.target);
        return e;
      });
    }
    
    /* shims RTCConnectionState by pretending it is the same as iceConnectionState.
     * See https://bugs.chromium.org/p/webrtc/issues/detail?id=6145#c12
     * for why this is a valid hack in Chrome. In Firefox it is slightly incorrect
     * since DTLS failures would be hidden. See
     * https://bugzilla.mozilla.org/show_bug.cgi?id=1265827
     * for the Firefox tracking bug.
     */
    function shimConnectionState(window) {
      if (!window.RTCPeerConnection || 'connectionState' in window.RTCPeerConnection.prototype) {
        return;
      }
      var proto = window.RTCPeerConnection.prototype;
      Object.defineProperty(proto, 'connectionState', {
        get: function get() {
          return {
            completed: 'connected',
            checking: 'connecting'
          }[this.iceConnectionState] || this.iceConnectionState;
        },
    
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(proto, 'onconnectionstatechange', {
        get: function get() {
          return this._onconnectionstatechange || null;
        },
        set: function set(cb) {
          if (this._onconnectionstatechange) {
            this.removeEventListener('connectionstatechange', this._onconnectionstatechange);
            delete this._onconnectionstatechange;
          }
          if (cb) {
            this.addEventListener('connectionstatechange', this._onconnectionstatechange = cb);
          }
        },
    
        enumerable: true,
        configurable: true
      });
    
      ['setLocalDescription', 'setRemoteDescription'].forEach(function (method) {
        var origMethod = proto[method];
        proto[method] = function () {
          if (!this._connectionstatechangepoly) {
            this._connectionstatechangepoly = function (e) {
              var pc = e.target;
              if (pc._lastConnectionState !== pc.connectionState) {
                pc._lastConnectionState = pc.connectionState;
                var newEvent = new Event('connectionstatechange', e);
                pc.dispatchEvent(newEvent);
              }
              return e;
            };
            this.addEventListener('iceconnectionstatechange', this._connectionstatechangepoly);
          }
          return origMethod.apply(this, arguments);
        };
      });
    }
    
    function removeAllowExtmapMixed(window) {
      /* remove a=extmap-allow-mixed for Chrome < M71 */
      if (!window.RTCPeerConnection) {
        return;
      }
      var browserDetails = utils.detectBrowser(window);
      if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
        return;
      }
      var nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription = function (desc) {
        if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
          desc.sdp = desc.sdp.split('\n').filter(function (line) {
            return line.trim() !== 'a=extmap-allow-mixed';
          }).join('\n');
        }
        return nativeSRD.apply(this, arguments);
      };
    }
    
    },{"./utils":15,"sdp":17}],7:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;
    
    var _getusermedia = require('./getusermedia');
    
    Object.defineProperty(exports, 'shimGetUserMedia', {
      enumerable: true,
      get: function get() {
        return _getusermedia.shimGetUserMedia;
      }
    });
    
    var _getdisplaymedia = require('./getdisplaymedia');
    
    Object.defineProperty(exports, 'shimGetDisplayMedia', {
      enumerable: true,
      get: function get() {
        return _getdisplaymedia.shimGetDisplayMedia;
      }
    });
    exports.shimPeerConnection = shimPeerConnection;
    exports.shimReplaceTrack = shimReplaceTrack;
    
    var _utils = require('../utils');
    
    var utils = _interopRequireWildcard(_utils);
    
    var _filtericeservers = require('./filtericeservers');
    
    var _rtcpeerconnectionShim = require('rtcpeerconnection-shim');
    
    var _rtcpeerconnectionShim2 = _interopRequireDefault(_rtcpeerconnectionShim);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    function shimPeerConnection(window) {
      var browserDetails = utils.detectBrowser(window);
    
      if (window.RTCIceGatherer) {
        if (!window.RTCIceCandidate) {
          window.RTCIceCandidate = function (args) {
            return args;
          };
        }
        if (!window.RTCSessionDescription) {
          window.RTCSessionDescription = function (args) {
            return args;
          };
        }
        // this adds an additional event listener to MediaStrackTrack that signals
        // when a tracks enabled property was changed. Workaround for a bug in
        // addStream, see below. No longer required in 15025+
        if (browserDetails.version < 15025) {
          var origMSTEnabled = Object.getOwnPropertyDescriptor(window.MediaStreamTrack.prototype, 'enabled');
          Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
            set: function set(value) {
              origMSTEnabled.set.call(this, value);
              var ev = new Event('enabled');
              ev.enabled = value;
              this.dispatchEvent(ev);
            }
          });
        }
      }
    
      // ORTC defines the DTMF sender a bit different.
      // https://github.com/w3c/ortc/issues/714
      if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
        Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
          get: function get() {
            if (this._dtmf === undefined) {
              if (this.track.kind === 'audio') {
                this._dtmf = new window.RTCDtmfSender(this);
              } else if (this.track.kind === 'video') {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          }
        });
      }
      // Edge currently only implements the RTCDtmfSender, not the
      // RTCDTMFSender alias. See http://draft.ortc.org/#rtcdtmfsender2*
      if (window.RTCDtmfSender && !window.RTCDTMFSender) {
        window.RTCDTMFSender = window.RTCDtmfSender;
      }
    
      var RTCPeerConnectionShim = (0, _rtcpeerconnectionShim2.default)(window, browserDetails.version);
      window.RTCPeerConnection = function (config) {
        if (config && config.iceServers) {
          config.iceServers = (0, _filtericeservers.filterIceServers)(config.iceServers, browserDetails.version);
          utils.log('ICE servers after filtering:', config.iceServers);
        }
        return new RTCPeerConnectionShim(config);
      };
      window.RTCPeerConnection.prototype = RTCPeerConnectionShim.prototype;
    }
    
    function shimReplaceTrack(window) {
      // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
      if (window.RTCRtpSender && !('replaceTrack' in window.RTCRtpSender.prototype)) {
        window.RTCRtpSender.prototype.replaceTrack = window.RTCRtpSender.prototype.setTrack;
      }
    }
    
    },{"../utils":15,"./filtericeservers":8,"./getdisplaymedia":9,"./getusermedia":10,"rtcpeerconnection-shim":16}],8:[function(require,module,exports){
    /*
     *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.filterIceServers = filterIceServers;
    
    var _utils = require('../utils');
    
    var utils = _interopRequireWildcard(_utils);
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    // Edge does not like
    // 1) stun: filtered after 14393 unless ?transport=udp is present
    // 2) turn: that does not have all of turn:host:port?transport=udp
    // 3) turn: with ipv6 addresses
    // 4) turn: occurring muliple times
    function filterIceServers(iceServers, edgeVersion) {
      var hasTurn = false;
      iceServers = JSON.parse(JSON.stringify(iceServers));
      return iceServers.filter(function (server) {
        if (server && (server.urls || server.url)) {
          var urls = server.urls || server.url;
          if (server.url && !server.urls) {
            utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
          }
          var isString = typeof urls === 'string';
          if (isString) {
            urls = [urls];
          }
          urls = urls.filter(function (url) {
            // filter STUN unconditionally.
            if (url.indexOf('stun:') === 0) {
              return false;
            }
    
            var validTurn = url.startsWith('turn') && !url.startsWith('turn:[') && url.includes('transport=udp');
            if (validTurn && !hasTurn) {
              hasTurn = true;
              return true;
            }
            return validTurn && !hasTurn;
          });
    
          delete server.url;
          server.urls = isString ? urls[0] : urls;
          return !!urls.length;
        }
      });
    }
    
    },{"../utils":15}],9:[function(require,module,exports){
    /*
     *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetDisplayMedia = shimGetDisplayMedia;
    function shimGetDisplayMedia(window) {
      if (!('getDisplayMedia' in window.navigator)) {
        return;
      }
      if (!window.navigator.mediaDevices) {
        return;
      }
      if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia = window.navigator.getDisplayMedia.bind(window.navigator);
    }
    
    },{}],10:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetUserMedia = shimGetUserMedia;
    function shimGetUserMedia(window) {
      var navigator = window && window.navigator;
    
      var shimError_ = function shimError_(e) {
        return {
          name: { PermissionDeniedError: 'NotAllowedError' }[e.name] || e.name,
          message: e.message,
          constraint: e.constraint,
          toString: function toString() {
            return this.name;
          }
        };
      };
    
      // getUserMedia error shim.
      var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = function (c) {
        return origGetUserMedia(c).catch(function (e) {
          return Promise.reject(shimError_(e));
        });
      };
    }
    
    },{}],11:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    var _getusermedia = require('./getusermedia');
    
    Object.defineProperty(exports, 'shimGetUserMedia', {
      enumerable: true,
      get: function get() {
        return _getusermedia.shimGetUserMedia;
      }
    });
    
    var _getdisplaymedia = require('./getdisplaymedia');
    
    Object.defineProperty(exports, 'shimGetDisplayMedia', {
      enumerable: true,
      get: function get() {
        return _getdisplaymedia.shimGetDisplayMedia;
      }
    });
    exports.shimOnTrack = shimOnTrack;
    exports.shimPeerConnection = shimPeerConnection;
    exports.shimSenderGetStats = shimSenderGetStats;
    exports.shimReceiverGetStats = shimReceiverGetStats;
    exports.shimRemoveStream = shimRemoveStream;
    exports.shimRTCDataChannel = shimRTCDataChannel;
    
    var _utils = require('../utils');
    
    var utils = _interopRequireWildcard(_utils);
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    function shimOnTrack(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
        Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
          get: function get() {
            return { receiver: this.receiver };
          }
        });
      }
    }
    
    function shimPeerConnection(window) {
      var browserDetails = utils.detectBrowser(window);
    
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
        return; // probably media.peerconnection.enabled=false in about:config
      }
      if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
        // very basic support for old versions.
        window.RTCPeerConnection = window.mozRTCPeerConnection;
      }
    
      // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
        var nativeMethod = window.RTCPeerConnection.prototype[method];
        window.RTCPeerConnection.prototype[method] = function () {
          arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
          return nativeMethod.apply(this, arguments);
        };
      });
    
      // support for addIceCandidate(null or undefined)
      var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
      window.RTCPeerConnection.prototype.addIceCandidate = function () {
        if (!arguments[0]) {
          if (arguments[1]) {
            arguments[1].apply(null);
          }
          return Promise.resolve();
        }
        return nativeAddIceCandidate.apply(this, arguments);
      };
    
      var modernStatsTypes = {
        inboundrtp: 'inbound-rtp',
        outboundrtp: 'outbound-rtp',
        candidatepair: 'candidate-pair',
        localcandidate: 'local-candidate',
        remotecandidate: 'remote-candidate'
      };
    
      var nativeGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function (selector, onSucc, onErr) {
        return nativeGetStats.apply(this, [selector || null]).then(function (stats) {
          if (browserDetails.version < 53 && !onSucc) {
            // Shim only promise getStats with spec-hyphens in type names
            // Leave callback version alone; misc old uses of forEach before Map
            try {
              stats.forEach(function (stat) {
                stat.type = modernStatsTypes[stat.type] || stat.type;
              });
            } catch (e) {
              if (e.name !== 'TypeError') {
                throw e;
              }
              // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
              stats.forEach(function (stat, i) {
                stats.set(i, Object.assign({}, stat, {
                  type: modernStatsTypes[stat.type] || stat.type
                }));
              });
            }
          }
          return stats;
        }).then(onSucc, onErr);
      };
    }
    
    function shimSenderGetStats(window) {
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
        return;
      }
      if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
        return;
      }
      var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
      if (origGetSenders) {
        window.RTCPeerConnection.prototype.getSenders = function () {
          var _this = this;
    
          var senders = origGetSenders.apply(this, []);
          senders.forEach(function (sender) {
            return sender._pc = _this;
          });
          return senders;
        };
      }
    
      var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      if (origAddTrack) {
        window.RTCPeerConnection.prototype.addTrack = function () {
          var sender = origAddTrack.apply(this, arguments);
          sender._pc = this;
          return sender;
        };
      }
      window.RTCRtpSender.prototype.getStats = function () {
        return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map());
      };
    }
    
    function shimReceiverGetStats(window) {
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
        return;
      }
      if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
        return;
      }
      var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
      if (origGetReceivers) {
        window.RTCPeerConnection.prototype.getReceivers = function () {
          var _this2 = this;
    
          var receivers = origGetReceivers.apply(this, []);
          receivers.forEach(function (receiver) {
            return receiver._pc = _this2;
          });
          return receivers;
        };
      }
      utils.wrapPeerConnectionEvent(window, 'track', function (e) {
        e.receiver._pc = e.srcElement;
        return e;
      });
      window.RTCRtpReceiver.prototype.getStats = function () {
        return this._pc.getStats(this.track);
      };
    }
    
    function shimRemoveStream(window) {
      if (!window.RTCPeerConnection || 'removeStream' in window.RTCPeerConnection.prototype) {
        return;
      }
      window.RTCPeerConnection.prototype.removeStream = function (stream) {
        var _this3 = this;
    
        utils.deprecated('removeStream', 'removeTrack');
        this.getSenders().forEach(function (sender) {
          if (sender.track && stream.getTracks().includes(sender.track)) {
            _this3.removeTrack(sender);
          }
        });
      };
    }
    
    function shimRTCDataChannel(window) {
      // rename DataChannel to RTCDataChannel (native fix in FF60):
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
      if (window.DataChannel && !window.RTCDataChannel) {
        window.RTCDataChannel = window.DataChannel;
      }
    }
    
    },{"../utils":15,"./getdisplaymedia":12,"./getusermedia":13}],12:[function(require,module,exports){
    /*
     *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetDisplayMedia = shimGetDisplayMedia;
    function shimGetDisplayMedia(window, preferredMediaSource) {
      if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
        return;
      }
      if (!window.navigator.mediaDevices) {
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia = function (constraints) {
        if (!(constraints && constraints.video)) {
          var err = new DOMException('getDisplayMedia without video ' + 'constraints is undefined');
          err.name = 'NotFoundError';
          // from https://heycam.github.io/webidl/#idl-DOMException-error-names
          err.code = 8;
          return Promise.reject(err);
        }
        if (constraints.video === true) {
          constraints.video = { mediaSource: preferredMediaSource };
        } else {
          constraints.video.mediaSource = preferredMediaSource;
        }
        return window.navigator.mediaDevices.getUserMedia(constraints);
      };
    }
    
    },{}],13:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    exports.shimGetUserMedia = shimGetUserMedia;
    
    var _utils = require('../utils');
    
    var utils = _interopRequireWildcard(_utils);
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    function shimGetUserMedia(window) {
      var browserDetails = utils.detectBrowser(window);
      var navigator = window && window.navigator;
      var MediaStreamTrack = window && window.MediaStreamTrack;
    
      navigator.getUserMedia = function (constraints, onSuccess, onError) {
        // Replace Firefox 44+'s deprecation warning with unprefixed version.
        utils.deprecated('navigator.getUserMedia', 'navigator.mediaDevices.getUserMedia');
        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
      };
    
      if (!(browserDetails.version > 55 && 'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
        var remap = function remap(obj, a, b) {
          if (a in obj && !(b in obj)) {
            obj[b] = obj[a];
            delete obj[a];
          }
        };
    
        var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function (c) {
          if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object' && _typeof(c.audio) === 'object') {
            c = JSON.parse(JSON.stringify(c));
            remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
            remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
          }
          return nativeGetUserMedia(c);
        };
    
        if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
          var nativeGetSettings = MediaStreamTrack.prototype.getSettings;
          MediaStreamTrack.prototype.getSettings = function () {
            var obj = nativeGetSettings.apply(this, arguments);
            remap(obj, 'mozAutoGainControl', 'autoGainControl');
            remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
            return obj;
          };
        }
    
        if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
          var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
          MediaStreamTrack.prototype.applyConstraints = function (c) {
            if (this.kind === 'audio' && (typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object') {
              c = JSON.parse(JSON.stringify(c));
              remap(c, 'autoGainControl', 'mozAutoGainControl');
              remap(c, 'noiseSuppression', 'mozNoiseSuppression');
            }
            return nativeApplyConstraints.apply(this, [c]);
          };
        }
      }
    }
    
    },{"../utils":15}],14:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    exports.shimLocalStreamsAPI = shimLocalStreamsAPI;
    exports.shimRemoteStreamsAPI = shimRemoteStreamsAPI;
    exports.shimCallbacksAPI = shimCallbacksAPI;
    exports.shimGetUserMedia = shimGetUserMedia;
    exports.shimConstraints = shimConstraints;
    exports.shimRTCIceServerUrls = shimRTCIceServerUrls;
    exports.shimTrackEventTransceiver = shimTrackEventTransceiver;
    exports.shimCreateOfferLegacy = shimCreateOfferLegacy;
    
    var _utils = require('../utils');
    
    var utils = _interopRequireWildcard(_utils);
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    function shimLocalStreamsAPI(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
        return;
      }
      if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.getLocalStreams = function () {
          if (!this._localStreams) {
            this._localStreams = [];
          }
          return this._localStreams;
        };
      }
      if (!('addStream' in window.RTCPeerConnection.prototype)) {
        var _addTrack = window.RTCPeerConnection.prototype.addTrack;
        window.RTCPeerConnection.prototype.addStream = function (stream) {
          var _this = this;
    
          if (!this._localStreams) {
            this._localStreams = [];
          }
          if (!this._localStreams.includes(stream)) {
            this._localStreams.push(stream);
          }
          stream.getTracks().forEach(function (track) {
            return _addTrack.call(_this, track, stream);
          });
        };
    
        window.RTCPeerConnection.prototype.addTrack = function (track, stream) {
          if (stream) {
            if (!this._localStreams) {
              this._localStreams = [stream];
            } else if (!this._localStreams.includes(stream)) {
              this._localStreams.push(stream);
            }
          }
          return _addTrack.call(this, track, stream);
        };
      }
      if (!('removeStream' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.removeStream = function (stream) {
          var _this2 = this;
    
          if (!this._localStreams) {
            this._localStreams = [];
          }
          var index = this._localStreams.indexOf(stream);
          if (index === -1) {
            return;
          }
          this._localStreams.splice(index, 1);
          var tracks = stream.getTracks();
          this.getSenders().forEach(function (sender) {
            if (tracks.includes(sender.track)) {
              _this2.removeTrack(sender);
            }
          });
        };
      }
    }
    
    function shimRemoteStreamsAPI(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
        return;
      }
      if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.getRemoteStreams = function () {
          return this._remoteStreams ? this._remoteStreams : [];
        };
      }
      if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
          get: function get() {
            return this._onaddstream;
          },
          set: function set(f) {
            var _this3 = this;
    
            if (this._onaddstream) {
              this.removeEventListener('addstream', this._onaddstream);
              this.removeEventListener('track', this._onaddstreampoly);
            }
            this.addEventListener('addstream', this._onaddstream = f);
            this.addEventListener('track', this._onaddstreampoly = function (e) {
              e.streams.forEach(function (stream) {
                if (!_this3._remoteStreams) {
                  _this3._remoteStreams = [];
                }
                if (_this3._remoteStreams.includes(stream)) {
                  return;
                }
                _this3._remoteStreams.push(stream);
                var event = new Event('addstream');
                event.stream = stream;
                _this3.dispatchEvent(event);
              });
            });
          }
        });
        var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription = function () {
          var pc = this;
          if (!this._onaddstreampoly) {
            this.addEventListener('track', this._onaddstreampoly = function (e) {
              e.streams.forEach(function (stream) {
                if (!pc._remoteStreams) {
                  pc._remoteStreams = [];
                }
                if (pc._remoteStreams.indexOf(stream) >= 0) {
                  return;
                }
                pc._remoteStreams.push(stream);
                var event = new Event('addstream');
                event.stream = stream;
                pc.dispatchEvent(event);
              });
            });
          }
          return origSetRemoteDescription.apply(pc, arguments);
        };
      }
    }
    
    function shimCallbacksAPI(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
        return;
      }
      var prototype = window.RTCPeerConnection.prototype;
      var createOffer = prototype.createOffer;
      var createAnswer = prototype.createAnswer;
      var setLocalDescription = prototype.setLocalDescription;
      var setRemoteDescription = prototype.setRemoteDescription;
      var addIceCandidate = prototype.addIceCandidate;
    
      prototype.createOffer = function (successCallback, failureCallback) {
        var options = arguments.length >= 2 ? arguments[2] : arguments[0];
        var promise = createOffer.apply(this, [options]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
    
      prototype.createAnswer = function (successCallback, failureCallback) {
        var options = arguments.length >= 2 ? arguments[2] : arguments[0];
        var promise = createAnswer.apply(this, [options]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
    
      var withCallback = function withCallback(description, successCallback, failureCallback) {
        var promise = setLocalDescription.apply(this, [description]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.setLocalDescription = withCallback;
    
      withCallback = function withCallback(description, successCallback, failureCallback) {
        var promise = setRemoteDescription.apply(this, [description]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.setRemoteDescription = withCallback;
    
      withCallback = function withCallback(candidate, successCallback, failureCallback) {
        var promise = addIceCandidate.apply(this, [candidate]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.addIceCandidate = withCallback;
    }
    
    function shimGetUserMedia(window) {
      var navigator = window && window.navigator;
    
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // shim not needed in Safari 12.1
        var mediaDevices = navigator.mediaDevices;
        var _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
        navigator.mediaDevices.getUserMedia = function (constraints) {
          return _getUserMedia(shimConstraints(constraints));
        };
      }
    
      if (!navigator.getUserMedia && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.getUserMedia = function (constraints, cb, errcb) {
          navigator.mediaDevices.getUserMedia(constraints).then(cb, errcb);
        }.bind(navigator);
      }
    }
    
    function shimConstraints(constraints) {
      if (constraints && constraints.video !== undefined) {
        return Object.assign({}, constraints, { video: utils.compactObject(constraints.video) });
      }
    
      return constraints;
    }
    
    function shimRTCIceServerUrls(window) {
      // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
      var OrigPeerConnection = window.RTCPeerConnection;
      window.RTCPeerConnection = function (pcConfig, pcConstraints) {
        if (pcConfig && pcConfig.iceServers) {
          var newIceServers = [];
          for (var i = 0; i < pcConfig.iceServers.length; i++) {
            var server = pcConfig.iceServers[i];
            if (!server.hasOwnProperty('urls') && server.hasOwnProperty('url')) {
              utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
              server = JSON.parse(JSON.stringify(server));
              server.urls = server.url;
              delete server.url;
              newIceServers.push(server);
            } else {
              newIceServers.push(pcConfig.iceServers[i]);
            }
          }
          pcConfig.iceServers = newIceServers;
        }
        return new OrigPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
      // wrap static methods. Currently just generateCertificate.
      if ('generateCertificate' in window.RTCPeerConnection) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get: function get() {
            return OrigPeerConnection.generateCertificate;
          }
        });
      }
    }
    
    function shimTrackEventTransceiver(window) {
      // Add event.transceiver member over deprecated event.receiver
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && 'receiver' in window.RTCTrackEvent.prototype &&
      // can't check 'transceiver' in window.RTCTrackEvent.prototype, as it is
      // defined for some reason even when window.RTCTransceiver is not.
      !window.RTCTransceiver) {
        Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
          get: function get() {
            return { receiver: this.receiver };
          }
        });
      }
    }
    
    function shimCreateOfferLegacy(window) {
      var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
      window.RTCPeerConnection.prototype.createOffer = function (offerOptions) {
        if (offerOptions) {
          if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
            // support bit values
            offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
          }
          var audioTransceiver = this.getTransceivers().find(function (transceiver) {
            return transceiver.receiver.track.kind === 'audio';
          });
          if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
            if (audioTransceiver.direction === 'sendrecv') {
              if (audioTransceiver.setDirection) {
                audioTransceiver.setDirection('sendonly');
              } else {
                audioTransceiver.direction = 'sendonly';
              }
            } else if (audioTransceiver.direction === 'recvonly') {
              if (audioTransceiver.setDirection) {
                audioTransceiver.setDirection('inactive');
              } else {
                audioTransceiver.direction = 'inactive';
              }
            }
          } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
            this.addTransceiver('audio');
          }
    
          if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
            // support bit values
            offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
          }
          var videoTransceiver = this.getTransceivers().find(function (transceiver) {
            return transceiver.receiver.track.kind === 'video';
          });
          if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
            if (videoTransceiver.direction === 'sendrecv') {
              if (videoTransceiver.setDirection) {
                videoTransceiver.setDirection('sendonly');
              } else {
                videoTransceiver.direction = 'sendonly';
              }
            } else if (videoTransceiver.direction === 'recvonly') {
              if (videoTransceiver.setDirection) {
                videoTransceiver.setDirection('inactive');
              } else {
                videoTransceiver.direction = 'inactive';
              }
            }
          } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
            this.addTransceiver('video');
          }
        }
        return origCreateOffer.apply(this, arguments);
      };
    }
    
    },{"../utils":15}],15:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    exports.extractVersion = extractVersion;
    exports.wrapPeerConnectionEvent = wrapPeerConnectionEvent;
    exports.disableLog = disableLog;
    exports.disableWarnings = disableWarnings;
    exports.log = log;
    exports.deprecated = deprecated;
    exports.detectBrowser = detectBrowser;
    exports.compactObject = compactObject;
    exports.walkStats = walkStats;
    exports.filterStats = filterStats;
    
    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
    
    var logDisabled_ = true;
    var deprecationWarnings_ = true;
    
    /**
     * Extract browser version out of the provided user agent string.
     *
     * @param {!string} uastring userAgent string.
     * @param {!string} expr Regular expression used as match criteria.
     * @param {!number} pos position in the version string to be returned.
     * @return {!number} browser version.
     */
    function extractVersion(uastring, expr, pos) {
      var match = uastring.match(expr);
      return match && match.length >= pos && parseInt(match[pos], 10);
    }
    
    // Wraps the peerconnection event eventNameToWrap in a function
    // which returns the modified event object (or false to prevent
    // the event).
    function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
      if (!window.RTCPeerConnection) {
        return;
      }
      var proto = window.RTCPeerConnection.prototype;
      var nativeAddEventListener = proto.addEventListener;
      proto.addEventListener = function (nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap) {
          return nativeAddEventListener.apply(this, arguments);
        }
        var wrappedCallback = function wrappedCallback(e) {
          var modifiedEvent = wrapper(e);
          if (modifiedEvent) {
            cb(modifiedEvent);
          }
        };
        this._eventMap = this._eventMap || {};
        this._eventMap[cb] = wrappedCallback;
        return nativeAddEventListener.apply(this, [nativeEventName, wrappedCallback]);
      };
    
      var nativeRemoveEventListener = proto.removeEventListener;
      proto.removeEventListener = function (nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[cb]) {
          return nativeRemoveEventListener.apply(this, arguments);
        }
        var unwrappedCb = this._eventMap[cb];
        delete this._eventMap[cb];
        return nativeRemoveEventListener.apply(this, [nativeEventName, unwrappedCb]);
      };
    
      Object.defineProperty(proto, 'on' + eventNameToWrap, {
        get: function get() {
          return this['_on' + eventNameToWrap];
        },
        set: function set(cb) {
          if (this['_on' + eventNameToWrap]) {
            this.removeEventListener(eventNameToWrap, this['_on' + eventNameToWrap]);
            delete this['_on' + eventNameToWrap];
          }
          if (cb) {
            this.addEventListener(eventNameToWrap, this['_on' + eventNameToWrap] = cb);
          }
        },
    
        enumerable: true,
        configurable: true
      });
    }
    
    function disableLog(bool) {
      if (typeof bool !== 'boolean') {
        return new Error('Argument type: ' + (typeof bool === 'undefined' ? 'undefined' : _typeof(bool)) + '. Please use a boolean.');
      }
      logDisabled_ = bool;
      return bool ? 'adapter.js logging disabled' : 'adapter.js logging enabled';
    }
    
    /**
     * Disable or enable deprecation warnings
     * @param {!boolean} bool set to true to disable warnings.
     */
    function disableWarnings(bool) {
      if (typeof bool !== 'boolean') {
        return new Error('Argument type: ' + (typeof bool === 'undefined' ? 'undefined' : _typeof(bool)) + '. Please use a boolean.');
      }
      deprecationWarnings_ = !bool;
      return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
    }
    
    function log() {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
        if (logDisabled_) {
          return;
        }
        if (typeof console !== 'undefined' && typeof console.log === 'function') {
          console.log.apply(console, arguments);
        }
      }
    }
    
    /**
     * Shows a deprecation warning suggesting the modern and spec-compatible API.
     */
    function deprecated(oldMethod, newMethod) {
      if (!deprecationWarnings_) {
        return;
      }
      console.warn(oldMethod + ' is deprecated, please use ' + newMethod + ' instead.');
    }
    
    /**
     * Browser detector.
     *
     * @return {object} result containing browser and version
     *     properties.
     */
    function detectBrowser(window) {
      var navigator = window.navigator;
    
      // Returned result object.
    
      var result = { browser: null, version: null };
    
      // Fail early if it's not a browser
      if (typeof window === 'undefined' || !window.navigator) {
        result.browser = 'Not a browser.';
        return result;
      }
    
      if (navigator.mozGetUserMedia) {
        // Firefox.
        result.browser = 'firefox';
        result.version = extractVersion(navigator.userAgent, /Firefox\/(\d+)\./, 1);
      } else if (navigator.webkitGetUserMedia || window.isSecureContext === false && window.webkitRTCPeerConnection && !window.RTCIceGatherer) {
        // Chrome, Chromium, Webview, Opera.
        // Version matches Chrome/WebRTC version.
        // Chrome 74 removed webkitGetUserMedia on http as well so we need the
        // more complicated fallback to webkitRTCPeerConnection.
        result.browser = 'chrome';
        result.version = extractVersion(navigator.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
      } else if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
        // Edge.
        result.browser = 'edge';
        result.version = extractVersion(navigator.userAgent, /Edge\/(\d+).(\d+)$/, 2);
      } else if (window.RTCPeerConnection && navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
        // Safari.
        result.browser = 'safari';
        result.version = extractVersion(navigator.userAgent, /AppleWebKit\/(\d+)\./, 1);
      } else {
        // Default fallthrough: not supported.
        result.browser = 'Not a supported browser.';
        return result;
      }
    
      return result;
    }
    
    /**
     * Remove all empty objects and undefined values
     * from a nested object -- an enhanced and vanilla version
     * of Lodash's `compact`.
     */
    function compactObject(data) {
      if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
        return data;
      }
    
      return Object.keys(data).reduce(function (accumulator, key) {
        var isObject = _typeof(data[key]) === 'object';
        var value = isObject ? compactObject(data[key]) : data[key];
        var isEmptyObject = isObject && !Object.keys(value).length;
        if (value === undefined || isEmptyObject) {
          return accumulator;
        }
    
        return Object.assign(accumulator, _defineProperty({}, key, value));
      }, {});
    }
    
    /* iterates the stats graph recursively. */
    function walkStats(stats, base, resultSet) {
      if (!base || resultSet.has(base.id)) {
        return;
      }
      resultSet.set(base.id, base);
      Object.keys(base).forEach(function (name) {
        if (name.endsWith('Id')) {
          walkStats(stats, stats.get(base[name]), resultSet);
        } else if (name.endsWith('Ids')) {
          base[name].forEach(function (id) {
            walkStats(stats, stats.get(id), resultSet);
          });
        }
      });
    }
    
    /* filter getStats for a sender/receiver track. */
    function filterStats(result, track, outbound) {
      var streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
      var filteredResult = new Map();
      if (track === null) {
        return filteredResult;
      }
      var trackStats = [];
      result.forEach(function (value) {
        if (value.type === 'track' && value.trackIdentifier === track.id) {
          trackStats.push(value);
        }
      });
      trackStats.forEach(function (trackStat) {
        result.forEach(function (stats) {
          if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
            walkStats(result, stats, filteredResult);
          }
        });
      });
      return filteredResult;
    }
    
    },{}],16:[function(require,module,exports){
    /*
     *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
     /* eslint-env node */
    'use strict';
    
    var SDPUtils = require('sdp');
    
    function fixStatsType(stat) {
      return {
        inboundrtp: 'inbound-rtp',
        outboundrtp: 'outbound-rtp',
        candidatepair: 'candidate-pair',
        localcandidate: 'local-candidate',
        remotecandidate: 'remote-candidate'
      }[stat.type] || stat.type;
    }
    
    function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
      var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);
    
      // Map ICE parameters (ufrag, pwd) to SDP.
      sdp += SDPUtils.writeIceParameters(
          transceiver.iceGatherer.getLocalParameters());
    
      // Map DTLS parameters to SDP.
      sdp += SDPUtils.writeDtlsParameters(
          transceiver.dtlsTransport.getLocalParameters(),
          type === 'offer' ? 'actpass' : dtlsRole || 'active');
    
      sdp += 'a=mid:' + transceiver.mid + '\r\n';
    
      if (transceiver.rtpSender && transceiver.rtpReceiver) {
        sdp += 'a=sendrecv\r\n';
      } else if (transceiver.rtpSender) {
        sdp += 'a=sendonly\r\n';
      } else if (transceiver.rtpReceiver) {
        sdp += 'a=recvonly\r\n';
      } else {
        sdp += 'a=inactive\r\n';
      }
    
      if (transceiver.rtpSender) {
        var trackId = transceiver.rtpSender._initialTrackId ||
            transceiver.rtpSender.track.id;
        transceiver.rtpSender._initialTrackId = trackId;
        // spec.
        var msid = 'msid:' + (stream ? stream.id : '-') + ' ' +
            trackId + '\r\n';
        sdp += 'a=' + msid;
        // for Chrome. Legacy should no longer be required.
        sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
            ' ' + msid;
    
        // RTX
        if (transceiver.sendEncodingParameters[0].rtx) {
          sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
              ' ' + msid;
          sdp += 'a=ssrc-group:FID ' +
              transceiver.sendEncodingParameters[0].ssrc + ' ' +
              transceiver.sendEncodingParameters[0].rtx.ssrc +
              '\r\n';
        }
      }
      // FIXME: this should be written by writeRtpDescription.
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
          ' cname:' + SDPUtils.localCName + '\r\n';
      if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
        sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
            ' cname:' + SDPUtils.localCName + '\r\n';
      }
      return sdp;
    }
    
    // Edge does not like
    // 1) stun: filtered after 14393 unless ?transport=udp is present
    // 2) turn: that does not have all of turn:host:port?transport=udp
    // 3) turn: with ipv6 addresses
    // 4) turn: occurring muliple times
    function filterIceServers(iceServers, edgeVersion) {
      var hasTurn = false;
      iceServers = JSON.parse(JSON.stringify(iceServers));
      return iceServers.filter(function(server) {
        if (server && (server.urls || server.url)) {
          var urls = server.urls || server.url;
          if (server.url && !server.urls) {
            console.warn('RTCIceServer.url is deprecated! Use urls instead.');
          }
          var isString = typeof urls === 'string';
          if (isString) {
            urls = [urls];
          }
          urls = urls.filter(function(url) {
            var validTurn = url.indexOf('turn:') === 0 &&
                url.indexOf('transport=udp') !== -1 &&
                url.indexOf('turn:[') === -1 &&
                !hasTurn;
    
            if (validTurn) {
              hasTurn = true;
              return true;
            }
            return url.indexOf('stun:') === 0 && edgeVersion >= 14393 &&
                url.indexOf('?transport=udp') === -1;
          });
    
          delete server.url;
          server.urls = isString ? urls[0] : urls;
          return !!urls.length;
        }
      });
    }
    
    // Determines the intersection of local and remote capabilities.
    function getCommonCapabilities(localCapabilities, remoteCapabilities) {
      var commonCapabilities = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: []
      };
    
      var findCodecByPayloadType = function(pt, codecs) {
        pt = parseInt(pt, 10);
        for (var i = 0; i < codecs.length; i++) {
          if (codecs[i].payloadType === pt ||
              codecs[i].preferredPayloadType === pt) {
            return codecs[i];
          }
        }
      };
    
      var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
        var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
        var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
        return lCodec && rCodec &&
            lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
      };
    
      localCapabilities.codecs.forEach(function(lCodec) {
        for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
          var rCodec = remoteCapabilities.codecs[i];
          if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
              lCodec.clockRate === rCodec.clockRate) {
            if (lCodec.name.toLowerCase() === 'rtx' &&
                lCodec.parameters && rCodec.parameters.apt) {
              // for RTX we need to find the local rtx that has a apt
              // which points to the same local codec as the remote one.
              if (!rtxCapabilityMatches(lCodec, rCodec,
                  localCapabilities.codecs, remoteCapabilities.codecs)) {
                continue;
              }
            }
            rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
            // number of channels is the highest common number of channels
            rCodec.numChannels = Math.min(lCodec.numChannels,
                rCodec.numChannels);
            // push rCodec so we reply with offerer payload type
            commonCapabilities.codecs.push(rCodec);
    
            // determine common feedback mechanisms
            rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
              for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
                if (lCodec.rtcpFeedback[j].type === fb.type &&
                    lCodec.rtcpFeedback[j].parameter === fb.parameter) {
                  return true;
                }
              }
              return false;
            });
            // FIXME: also need to determine .parameters
            //  see https://github.com/openpeer/ortc/issues/569
            break;
          }
        }
      });
    
      localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
        for (var i = 0; i < remoteCapabilities.headerExtensions.length;
             i++) {
          var rHeaderExtension = remoteCapabilities.headerExtensions[i];
          if (lHeaderExtension.uri === rHeaderExtension.uri) {
            commonCapabilities.headerExtensions.push(rHeaderExtension);
            break;
          }
        }
      });
    
      // FIXME: fecMechanisms
      return commonCapabilities;
    }
    
    // is action=setLocalDescription with type allowed in signalingState
    function isActionAllowedInSignalingState(action, type, signalingState) {
      return {
        offer: {
          setLocalDescription: ['stable', 'have-local-offer'],
          setRemoteDescription: ['stable', 'have-remote-offer']
        },
        answer: {
          setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
          setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
        }
      }[type][action].indexOf(signalingState) !== -1;
    }
    
    function maybeAddCandidate(iceTransport, candidate) {
      // Edge's internal representation adds some fields therefore
      // not all fieldÑ• are taken into account.
      var alreadyAdded = iceTransport.getRemoteCandidates()
          .find(function(remoteCandidate) {
            return candidate.foundation === remoteCandidate.foundation &&
                candidate.ip === remoteCandidate.ip &&
                candidate.port === remoteCandidate.port &&
                candidate.priority === remoteCandidate.priority &&
                candidate.protocol === remoteCandidate.protocol &&
                candidate.type === remoteCandidate.type;
          });
      if (!alreadyAdded) {
        iceTransport.addRemoteCandidate(candidate);
      }
      return !alreadyAdded;
    }
    
    
    function makeError(name, description) {
      var e = new Error(description);
      e.name = name;
      // legacy error codes from https://heycam.github.io/webidl/#idl-DOMException-error-names
      e.code = {
        NotSupportedError: 9,
        InvalidStateError: 11,
        InvalidAccessError: 15,
        TypeError: undefined,
        OperationError: undefined
      }[name];
      return e;
    }
    
    module.exports = function(window, edgeVersion) {
      // https://w3c.github.io/mediacapture-main/#mediastream
      // Helper function to add the track to the stream and
      // dispatch the event ourselves.
      function addTrackToStreamAndFireEvent(track, stream) {
        stream.addTrack(track);
        stream.dispatchEvent(new window.MediaStreamTrackEvent('addtrack',
            {track: track}));
      }
    
      function removeTrackFromStreamAndFireEvent(track, stream) {
        stream.removeTrack(track);
        stream.dispatchEvent(new window.MediaStreamTrackEvent('removetrack',
            {track: track}));
      }
    
      function fireAddTrack(pc, track, receiver, streams) {
        var trackEvent = new Event('track');
        trackEvent.track = track;
        trackEvent.receiver = receiver;
        trackEvent.transceiver = {receiver: receiver};
        trackEvent.streams = streams;
        window.setTimeout(function() {
          pc._dispatchEvent('track', trackEvent);
        });
      }
    
      var RTCPeerConnection = function(config) {
        var pc = this;
    
        var _eventTarget = document.createDocumentFragment();
        ['addEventListener', 'removeEventListener', 'dispatchEvent']
            .forEach(function(method) {
              pc[method] = _eventTarget[method].bind(_eventTarget);
            });
    
        this.canTrickleIceCandidates = null;
    
        this.needNegotiation = false;
    
        this.localStreams = [];
        this.remoteStreams = [];
    
        this._localDescription = null;
        this._remoteDescription = null;
    
        this.signalingState = 'stable';
        this.iceConnectionState = 'new';
        this.connectionState = 'new';
        this.iceGatheringState = 'new';
    
        config = JSON.parse(JSON.stringify(config || {}));
    
        this.usingBundle = config.bundlePolicy === 'max-bundle';
        if (config.rtcpMuxPolicy === 'negotiate') {
          throw(makeError('NotSupportedError',
              'rtcpMuxPolicy \'negotiate\' is not supported'));
        } else if (!config.rtcpMuxPolicy) {
          config.rtcpMuxPolicy = 'require';
        }
    
        switch (config.iceTransportPolicy) {
          case 'all':
          case 'relay':
            break;
          default:
            config.iceTransportPolicy = 'all';
            break;
        }
    
        switch (config.bundlePolicy) {
          case 'balanced':
          case 'max-compat':
          case 'max-bundle':
            break;
          default:
            config.bundlePolicy = 'balanced';
            break;
        }
    
        config.iceServers = filterIceServers(config.iceServers || [], edgeVersion);
    
        this._iceGatherers = [];
        if (config.iceCandidatePoolSize) {
          for (var i = config.iceCandidatePoolSize; i > 0; i--) {
            this._iceGatherers.push(new window.RTCIceGatherer({
              iceServers: config.iceServers,
              gatherPolicy: config.iceTransportPolicy
            }));
          }
        } else {
          config.iceCandidatePoolSize = 0;
        }
    
        this._config = config;
    
        // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
        // everything that is needed to describe a SDP m-line.
        this.transceivers = [];
    
        this._sdpSessionId = SDPUtils.generateSessionId();
        this._sdpSessionVersion = 0;
    
        this._dtlsRole = undefined; // role for a=setup to use in answers.
    
        this._isClosed = false;
      };
    
      Object.defineProperty(RTCPeerConnection.prototype, 'localDescription', {
        configurable: true,
        get: function() {
          return this._localDescription;
        }
      });
      Object.defineProperty(RTCPeerConnection.prototype, 'remoteDescription', {
        configurable: true,
        get: function() {
          return this._remoteDescription;
        }
      });
    
      // set up event handlers on prototype
      RTCPeerConnection.prototype.onicecandidate = null;
      RTCPeerConnection.prototype.onaddstream = null;
      RTCPeerConnection.prototype.ontrack = null;
      RTCPeerConnection.prototype.onremovestream = null;
      RTCPeerConnection.prototype.onsignalingstatechange = null;
      RTCPeerConnection.prototype.oniceconnectionstatechange = null;
      RTCPeerConnection.prototype.onconnectionstatechange = null;
      RTCPeerConnection.prototype.onicegatheringstatechange = null;
      RTCPeerConnection.prototype.onnegotiationneeded = null;
      RTCPeerConnection.prototype.ondatachannel = null;
    
      RTCPeerConnection.prototype._dispatchEvent = function(name, event) {
        if (this._isClosed) {
          return;
        }
        this.dispatchEvent(event);
        if (typeof this['on' + name] === 'function') {
          this['on' + name](event);
        }
      };
    
      RTCPeerConnection.prototype._emitGatheringStateChange = function() {
        var event = new Event('icegatheringstatechange');
        this._dispatchEvent('icegatheringstatechange', event);
      };
    
      RTCPeerConnection.prototype.getConfiguration = function() {
        return this._config;
      };
    
      RTCPeerConnection.prototype.getLocalStreams = function() {
        return this.localStreams;
      };
    
      RTCPeerConnection.prototype.getRemoteStreams = function() {
        return this.remoteStreams;
      };
    
      // internal helper to create a transceiver object.
      // (which is not yet the same as the WebRTC 1.0 transceiver)
      RTCPeerConnection.prototype._createTransceiver = function(kind, doNotAdd) {
        var hasBundleTransport = this.transceivers.length > 0;
        var transceiver = {
          track: null,
          iceGatherer: null,
          iceTransport: null,
          dtlsTransport: null,
          localCapabilities: null,
          remoteCapabilities: null,
          rtpSender: null,
          rtpReceiver: null,
          kind: kind,
          mid: null,
          sendEncodingParameters: null,
          recvEncodingParameters: null,
          stream: null,
          associatedRemoteMediaStreams: [],
          wantReceive: true
        };
        if (this.usingBundle && hasBundleTransport) {
          transceiver.iceTransport = this.transceivers[0].iceTransport;
          transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
        } else {
          var transports = this._createIceAndDtlsTransports();
          transceiver.iceTransport = transports.iceTransport;
          transceiver.dtlsTransport = transports.dtlsTransport;
        }
        if (!doNotAdd) {
          this.transceivers.push(transceiver);
        }
        return transceiver;
      };
    
      RTCPeerConnection.prototype.addTrack = function(track, stream) {
        if (this._isClosed) {
          throw makeError('InvalidStateError',
              'Attempted to call addTrack on a closed peerconnection.');
        }
    
        var alreadyExists = this.transceivers.find(function(s) {
          return s.track === track;
        });
    
        if (alreadyExists) {
          throw makeError('InvalidAccessError', 'Track already exists.');
        }
    
        var transceiver;
        for (var i = 0; i < this.transceivers.length; i++) {
          if (!this.transceivers[i].track &&
              this.transceivers[i].kind === track.kind) {
            transceiver = this.transceivers[i];
          }
        }
        if (!transceiver) {
          transceiver = this._createTransceiver(track.kind);
        }
    
        this._maybeFireNegotiationNeeded();
    
        if (this.localStreams.indexOf(stream) === -1) {
          this.localStreams.push(stream);
        }
    
        transceiver.track = track;
        transceiver.stream = stream;
        transceiver.rtpSender = new window.RTCRtpSender(track,
            transceiver.dtlsTransport);
        return transceiver.rtpSender;
      };
    
      RTCPeerConnection.prototype.addStream = function(stream) {
        var pc = this;
        if (edgeVersion >= 15025) {
          stream.getTracks().forEach(function(track) {
            pc.addTrack(track, stream);
          });
        } else {
          // Clone is necessary for local demos mostly, attaching directly
          // to two different senders does not work (build 10547).
          // Fixed in 15025 (or earlier)
          var clonedStream = stream.clone();
          stream.getTracks().forEach(function(track, idx) {
            var clonedTrack = clonedStream.getTracks()[idx];
            track.addEventListener('enabled', function(event) {
              clonedTrack.enabled = event.enabled;
            });
          });
          clonedStream.getTracks().forEach(function(track) {
            pc.addTrack(track, clonedStream);
          });
        }
      };
    
      RTCPeerConnection.prototype.removeTrack = function(sender) {
        if (this._isClosed) {
          throw makeError('InvalidStateError',
              'Attempted to call removeTrack on a closed peerconnection.');
        }
    
        if (!(sender instanceof window.RTCRtpSender)) {
          throw new TypeError('Argument 1 of RTCPeerConnection.removeTrack ' +
              'does not implement interface RTCRtpSender.');
        }
    
        var transceiver = this.transceivers.find(function(t) {
          return t.rtpSender === sender;
        });
    
        if (!transceiver) {
          throw makeError('InvalidAccessError',
              'Sender was not created by this connection.');
        }
        var stream = transceiver.stream;
    
        transceiver.rtpSender.stop();
        transceiver.rtpSender = null;
        transceiver.track = null;
        transceiver.stream = null;
    
        // remove the stream from the set of local streams
        var localStreams = this.transceivers.map(function(t) {
          return t.stream;
        });
        if (localStreams.indexOf(stream) === -1 &&
            this.localStreams.indexOf(stream) > -1) {
          this.localStreams.splice(this.localStreams.indexOf(stream), 1);
        }
    
        this._maybeFireNegotiationNeeded();
      };
    
      RTCPeerConnection.prototype.removeStream = function(stream) {
        var pc = this;
        stream.getTracks().forEach(function(track) {
          var sender = pc.getSenders().find(function(s) {
            return s.track === track;
          });
          if (sender) {
            pc.removeTrack(sender);
          }
        });
      };
    
      RTCPeerConnection.prototype.getSenders = function() {
        return this.transceivers.filter(function(transceiver) {
          return !!transceiver.rtpSender;
        })
        .map(function(transceiver) {
          return transceiver.rtpSender;
        });
      };
    
      RTCPeerConnection.prototype.getReceivers = function() {
        return this.transceivers.filter(function(transceiver) {
          return !!transceiver.rtpReceiver;
        })
        .map(function(transceiver) {
          return transceiver.rtpReceiver;
        });
      };
    
    
      RTCPeerConnection.prototype._createIceGatherer = function(sdpMLineIndex,
          usingBundle) {
        var pc = this;
        if (usingBundle && sdpMLineIndex > 0) {
          return this.transceivers[0].iceGatherer;
        } else if (this._iceGatherers.length) {
          return this._iceGatherers.shift();
        }
        var iceGatherer = new window.RTCIceGatherer({
          iceServers: this._config.iceServers,
          gatherPolicy: this._config.iceTransportPolicy
        });
        Object.defineProperty(iceGatherer, 'state',
            {value: 'new', writable: true}
        );
    
        this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
        this.transceivers[sdpMLineIndex].bufferCandidates = function(event) {
          var end = !event.candidate || Object.keys(event.candidate).length === 0;
          // polyfill since RTCIceGatherer.state is not implemented in
          // Edge 10547 yet.
          iceGatherer.state = end ? 'completed' : 'gathering';
          if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
            pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
          }
        };
        iceGatherer.addEventListener('localcandidate',
          this.transceivers[sdpMLineIndex].bufferCandidates);
        return iceGatherer;
      };
    
      // start gathering from an RTCIceGatherer.
      RTCPeerConnection.prototype._gather = function(mid, sdpMLineIndex) {
        var pc = this;
        var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
        if (iceGatherer.onlocalcandidate) {
          return;
        }
        var bufferedCandidateEvents =
          this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
        this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
        iceGatherer.removeEventListener('localcandidate',
          this.transceivers[sdpMLineIndex].bufferCandidates);
        iceGatherer.onlocalcandidate = function(evt) {
          if (pc.usingBundle && sdpMLineIndex > 0) {
            // if we know that we use bundle we can drop candidates with
            // Ñ•dpMLineIndex > 0. If we don't do this then our state gets
            // confused since we dispose the extra ice gatherer.
            return;
          }
          var event = new Event('icecandidate');
          event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};
    
          var cand = evt.candidate;
          // Edge emits an empty object for RTCIceCandidateCompleteâ€¥
          var end = !cand || Object.keys(cand).length === 0;
          if (end) {
            // polyfill since RTCIceGatherer.state is not implemented in
            // Edge 10547 yet.
            if (iceGatherer.state === 'new' || iceGatherer.state === 'gathering') {
              iceGatherer.state = 'completed';
            }
          } else {
            if (iceGatherer.state === 'new') {
              iceGatherer.state = 'gathering';
            }
            // RTCIceCandidate doesn't have a component, needs to be added
            cand.component = 1;
            // also the usernameFragment. TODO: update SDP to take both variants.
            cand.ufrag = iceGatherer.getLocalParameters().usernameFragment;
    
            var serializedCandidate = SDPUtils.writeCandidate(cand);
            event.candidate = Object.assign(event.candidate,
                SDPUtils.parseCandidate(serializedCandidate));
    
            event.candidate.candidate = serializedCandidate;
            event.candidate.toJSON = function() {
              return {
                candidate: event.candidate.candidate,
                sdpMid: event.candidate.sdpMid,
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                usernameFragment: event.candidate.usernameFragment
              };
            };
          }
    
          // update local description.
          var sections = SDPUtils.getMediaSections(pc._localDescription.sdp);
          if (!end) {
            sections[event.candidate.sdpMLineIndex] +=
                'a=' + event.candidate.candidate + '\r\n';
          } else {
            sections[event.candidate.sdpMLineIndex] +=
                'a=end-of-candidates\r\n';
          }
          pc._localDescription.sdp =
              SDPUtils.getDescription(pc._localDescription.sdp) +
              sections.join('');
          var complete = pc.transceivers.every(function(transceiver) {
            return transceiver.iceGatherer &&
                transceiver.iceGatherer.state === 'completed';
          });
    
          if (pc.iceGatheringState !== 'gathering') {
            pc.iceGatheringState = 'gathering';
            pc._emitGatheringStateChange();
          }
    
          // Emit candidate. Also emit null candidate when all gatherers are
          // complete.
          if (!end) {
            pc._dispatchEvent('icecandidate', event);
          }
          if (complete) {
            pc._dispatchEvent('icecandidate', new Event('icecandidate'));
            pc.iceGatheringState = 'complete';
            pc._emitGatheringStateChange();
          }
        };
    
        // emit already gathered candidates.
        window.setTimeout(function() {
          bufferedCandidateEvents.forEach(function(e) {
            iceGatherer.onlocalcandidate(e);
          });
        }, 0);
      };
    
      // Create ICE transport and DTLS transport.
      RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
        var pc = this;
        var iceTransport = new window.RTCIceTransport(null);
        iceTransport.onicestatechange = function() {
          pc._updateIceConnectionState();
          pc._updateConnectionState();
        };
    
        var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
        dtlsTransport.ondtlsstatechange = function() {
          pc._updateConnectionState();
        };
        dtlsTransport.onerror = function() {
          // onerror does not set state to failed by itself.
          Object.defineProperty(dtlsTransport, 'state',
              {value: 'failed', writable: true});
          pc._updateConnectionState();
        };
    
        return {
          iceTransport: iceTransport,
          dtlsTransport: dtlsTransport
        };
      };
    
      // Destroy ICE gatherer, ICE transport and DTLS transport.
      // Without triggering the callbacks.
      RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
          sdpMLineIndex) {
        var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
        if (iceGatherer) {
          delete iceGatherer.onlocalcandidate;
          delete this.transceivers[sdpMLineIndex].iceGatherer;
        }
        var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
        if (iceTransport) {
          delete iceTransport.onicestatechange;
          delete this.transceivers[sdpMLineIndex].iceTransport;
        }
        var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
        if (dtlsTransport) {
          delete dtlsTransport.ondtlsstatechange;
          delete dtlsTransport.onerror;
          delete this.transceivers[sdpMLineIndex].dtlsTransport;
        }
      };
    
      // Start the RTP Sender and Receiver for a transceiver.
      RTCPeerConnection.prototype._transceive = function(transceiver,
          send, recv) {
        var params = getCommonCapabilities(transceiver.localCapabilities,
            transceiver.remoteCapabilities);
        if (send && transceiver.rtpSender) {
          params.encodings = transceiver.sendEncodingParameters;
          params.rtcp = {
            cname: SDPUtils.localCName,
            compound: transceiver.rtcpParameters.compound
          };
          if (transceiver.recvEncodingParameters.length) {
            params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
          }
          transceiver.rtpSender.send(params);
        }
        if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
          // remove RTX field in Edge 14942
          if (transceiver.kind === 'video'
              && transceiver.recvEncodingParameters
              && edgeVersion < 15019) {
            transceiver.recvEncodingParameters.forEach(function(p) {
              delete p.rtx;
            });
          }
          if (transceiver.recvEncodingParameters.length) {
            params.encodings = transceiver.recvEncodingParameters;
          } else {
            params.encodings = [{}];
          }
          params.rtcp = {
            compound: transceiver.rtcpParameters.compound
          };
          if (transceiver.rtcpParameters.cname) {
            params.rtcp.cname = transceiver.rtcpParameters.cname;
          }
          if (transceiver.sendEncodingParameters.length) {
            params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
          }
          transceiver.rtpReceiver.receive(params);
        }
      };
    
      RTCPeerConnection.prototype.setLocalDescription = function(description) {
        var pc = this;
    
        // Note: pranswer is not supported.
        if (['offer', 'answer'].indexOf(description.type) === -1) {
          return Promise.reject(makeError('TypeError',
              'Unsupported type "' + description.type + '"'));
        }
    
        if (!isActionAllowedInSignalingState('setLocalDescription',
            description.type, pc.signalingState) || pc._isClosed) {
          return Promise.reject(makeError('InvalidStateError',
              'Can not set local ' + description.type +
              ' in state ' + pc.signalingState));
        }
    
        var sections;
        var sessionpart;
        if (description.type === 'offer') {
          // VERY limited support for SDP munging. Limited to:
          // * changing the order of codecs
          sections = SDPUtils.splitSections(description.sdp);
          sessionpart = sections.shift();
          sections.forEach(function(mediaSection, sdpMLineIndex) {
            var caps = SDPUtils.parseRtpParameters(mediaSection);
            pc.transceivers[sdpMLineIndex].localCapabilities = caps;
          });
    
          pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
            pc._gather(transceiver.mid, sdpMLineIndex);
          });
        } else if (description.type === 'answer') {
          sections = SDPUtils.splitSections(pc._remoteDescription.sdp);
          sessionpart = sections.shift();
          var isIceLite = SDPUtils.matchPrefix(sessionpart,
              'a=ice-lite').length > 0;
          sections.forEach(function(mediaSection, sdpMLineIndex) {
            var transceiver = pc.transceivers[sdpMLineIndex];
            var iceGatherer = transceiver.iceGatherer;
            var iceTransport = transceiver.iceTransport;
            var dtlsTransport = transceiver.dtlsTransport;
            var localCapabilities = transceiver.localCapabilities;
            var remoteCapabilities = transceiver.remoteCapabilities;
    
            // treat bundle-only as not-rejected.
            var rejected = SDPUtils.isRejected(mediaSection) &&
                SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
    
            if (!rejected && !transceiver.rejected) {
              var remoteIceParameters = SDPUtils.getIceParameters(
                  mediaSection, sessionpart);
              var remoteDtlsParameters = SDPUtils.getDtlsParameters(
                  mediaSection, sessionpart);
              if (isIceLite) {
                remoteDtlsParameters.role = 'server';
              }
    
              if (!pc.usingBundle || sdpMLineIndex === 0) {
                pc._gather(transceiver.mid, sdpMLineIndex);
                if (iceTransport.state === 'new') {
                  iceTransport.start(iceGatherer, remoteIceParameters,
                      isIceLite ? 'controlling' : 'controlled');
                }
                if (dtlsTransport.state === 'new') {
                  dtlsTransport.start(remoteDtlsParameters);
                }
              }
    
              // Calculate intersection of capabilities.
              var params = getCommonCapabilities(localCapabilities,
                  remoteCapabilities);
    
              // Start the RTCRtpSender. The RTCRtpReceiver for this
              // transceiver has already been started in setRemoteDescription.
              pc._transceive(transceiver,
                  params.codecs.length > 0,
                  false);
            }
          });
        }
    
        pc._localDescription = {
          type: description.type,
          sdp: description.sdp
        };
        if (description.type === 'offer') {
          pc._updateSignalingState('have-local-offer');
        } else {
          pc._updateSignalingState('stable');
        }
    
        return Promise.resolve();
      };
    
      RTCPeerConnection.prototype.setRemoteDescription = function(description) {
        var pc = this;
    
        // Note: pranswer is not supported.
        if (['offer', 'answer'].indexOf(description.type) === -1) {
          return Promise.reject(makeError('TypeError',
              'Unsupported type "' + description.type + '"'));
        }
    
        if (!isActionAllowedInSignalingState('setRemoteDescription',
            description.type, pc.signalingState) || pc._isClosed) {
          return Promise.reject(makeError('InvalidStateError',
              'Can not set remote ' + description.type +
              ' in state ' + pc.signalingState));
        }
    
        var streams = {};
        pc.remoteStreams.forEach(function(stream) {
          streams[stream.id] = stream;
        });
        var receiverList = [];
        var sections = SDPUtils.splitSections(description.sdp);
        var sessionpart = sections.shift();
        var isIceLite = SDPUtils.matchPrefix(sessionpart,
            'a=ice-lite').length > 0;
        var usingBundle = SDPUtils.matchPrefix(sessionpart,
            'a=group:BUNDLE ').length > 0;
        pc.usingBundle = usingBundle;
        var iceOptions = SDPUtils.matchPrefix(sessionpart,
            'a=ice-options:')[0];
        if (iceOptions) {
          pc.canTrickleIceCandidates = iceOptions.substr(14).split(' ')
              .indexOf('trickle') >= 0;
        } else {
          pc.canTrickleIceCandidates = false;
        }
    
        sections.forEach(function(mediaSection, sdpMLineIndex) {
          var lines = SDPUtils.splitLines(mediaSection);
          var kind = SDPUtils.getKind(mediaSection);
          // treat bundle-only as not-rejected.
          var rejected = SDPUtils.isRejected(mediaSection) &&
              SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
          var protocol = lines[0].substr(2).split(' ')[2];
    
          var direction = SDPUtils.getDirection(mediaSection, sessionpart);
          var remoteMsid = SDPUtils.parseMsid(mediaSection);
    
          var mid = SDPUtils.getMid(mediaSection) || SDPUtils.generateIdentifier();
    
          // Reject datachannels which are not implemented yet.
          if (rejected || (kind === 'application' && (protocol === 'DTLS/SCTP' ||
              protocol === 'UDP/DTLS/SCTP'))) {
            // TODO: this is dangerous in the case where a non-rejected m-line
            //     becomes rejected.
            pc.transceivers[sdpMLineIndex] = {
              mid: mid,
              kind: kind,
              protocol: protocol,
              rejected: true
            };
            return;
          }
    
          if (!rejected && pc.transceivers[sdpMLineIndex] &&
              pc.transceivers[sdpMLineIndex].rejected) {
            // recycle a rejected transceiver.
            pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
          }
    
          var transceiver;
          var iceGatherer;
          var iceTransport;
          var dtlsTransport;
          var rtpReceiver;
          var sendEncodingParameters;
          var recvEncodingParameters;
          var localCapabilities;
    
          var track;
          // FIXME: ensure the mediaSection has rtcp-mux set.
          var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
          var remoteIceParameters;
          var remoteDtlsParameters;
          if (!rejected) {
            remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
                sessionpart);
            remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
                sessionpart);
            remoteDtlsParameters.role = 'client';
          }
          recvEncodingParameters =
              SDPUtils.parseRtpEncodingParameters(mediaSection);
    
          var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);
    
          var isComplete = SDPUtils.matchPrefix(mediaSection,
              'a=end-of-candidates', sessionpart).length > 0;
          var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
              .map(function(cand) {
                return SDPUtils.parseCandidate(cand);
              })
              .filter(function(cand) {
                return cand.component === 1;
              });
    
          // Check if we can use BUNDLE and dispose transports.
          if ((description.type === 'offer' || description.type === 'answer') &&
              !rejected && usingBundle && sdpMLineIndex > 0 &&
              pc.transceivers[sdpMLineIndex]) {
            pc._disposeIceAndDtlsTransports(sdpMLineIndex);
            pc.transceivers[sdpMLineIndex].iceGatherer =
                pc.transceivers[0].iceGatherer;
            pc.transceivers[sdpMLineIndex].iceTransport =
                pc.transceivers[0].iceTransport;
            pc.transceivers[sdpMLineIndex].dtlsTransport =
                pc.transceivers[0].dtlsTransport;
            if (pc.transceivers[sdpMLineIndex].rtpSender) {
              pc.transceivers[sdpMLineIndex].rtpSender.setTransport(
                  pc.transceivers[0].dtlsTransport);
            }
            if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
              pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
                  pc.transceivers[0].dtlsTransport);
            }
          }
          if (description.type === 'offer' && !rejected) {
            transceiver = pc.transceivers[sdpMLineIndex] ||
                pc._createTransceiver(kind);
            transceiver.mid = mid;
    
            if (!transceiver.iceGatherer) {
              transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
                  usingBundle);
            }
    
            if (cands.length && transceiver.iceTransport.state === 'new') {
              if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
                transceiver.iceTransport.setRemoteCandidates(cands);
              } else {
                cands.forEach(function(candidate) {
                  maybeAddCandidate(transceiver.iceTransport, candidate);
                });
              }
            }
    
            localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);
    
            // filter RTX until additional stuff needed for RTX is implemented
            // in adapter.js
            if (edgeVersion < 15019) {
              localCapabilities.codecs = localCapabilities.codecs.filter(
                  function(codec) {
                    return codec.name !== 'rtx';
                  });
            }
    
            sendEncodingParameters = transceiver.sendEncodingParameters || [{
              ssrc: (2 * sdpMLineIndex + 2) * 1001
            }];
    
            // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
            var isNewTrack = false;
            if (direction === 'sendrecv' || direction === 'sendonly') {
              isNewTrack = !transceiver.rtpReceiver;
              rtpReceiver = transceiver.rtpReceiver ||
                  new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);
    
              if (isNewTrack) {
                var stream;
                track = rtpReceiver.track;
                // FIXME: does not work with Plan B.
                if (remoteMsid && remoteMsid.stream === '-') {
                  // no-op. a stream id of '-' means: no associated stream.
                } else if (remoteMsid) {
                  if (!streams[remoteMsid.stream]) {
                    streams[remoteMsid.stream] = new window.MediaStream();
                    Object.defineProperty(streams[remoteMsid.stream], 'id', {
                      get: function() {
                        return remoteMsid.stream;
                      }
                    });
                  }
                  Object.defineProperty(track, 'id', {
                    get: function() {
                      return remoteMsid.track;
                    }
                  });
                  stream = streams[remoteMsid.stream];
                } else {
                  if (!streams.default) {
                    streams.default = new window.MediaStream();
                  }
                  stream = streams.default;
                }
                if (stream) {
                  addTrackToStreamAndFireEvent(track, stream);
                  transceiver.associatedRemoteMediaStreams.push(stream);
                }
                receiverList.push([track, rtpReceiver, stream]);
              }
            } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
              transceiver.associatedRemoteMediaStreams.forEach(function(s) {
                var nativeTrack = s.getTracks().find(function(t) {
                  return t.id === transceiver.rtpReceiver.track.id;
                });
                if (nativeTrack) {
                  removeTrackFromStreamAndFireEvent(nativeTrack, s);
                }
              });
              transceiver.associatedRemoteMediaStreams = [];
            }
    
            transceiver.localCapabilities = localCapabilities;
            transceiver.remoteCapabilities = remoteCapabilities;
            transceiver.rtpReceiver = rtpReceiver;
            transceiver.rtcpParameters = rtcpParameters;
            transceiver.sendEncodingParameters = sendEncodingParameters;
            transceiver.recvEncodingParameters = recvEncodingParameters;
    
            // Start the RTCRtpReceiver now. The RTPSender is started in
            // setLocalDescription.
            pc._transceive(pc.transceivers[sdpMLineIndex],
                false,
                isNewTrack);
          } else if (description.type === 'answer' && !rejected) {
            transceiver = pc.transceivers[sdpMLineIndex];
            iceGatherer = transceiver.iceGatherer;
            iceTransport = transceiver.iceTransport;
            dtlsTransport = transceiver.dtlsTransport;
            rtpReceiver = transceiver.rtpReceiver;
            sendEncodingParameters = transceiver.sendEncodingParameters;
            localCapabilities = transceiver.localCapabilities;
    
            pc.transceivers[sdpMLineIndex].recvEncodingParameters =
                recvEncodingParameters;
            pc.transceivers[sdpMLineIndex].remoteCapabilities =
                remoteCapabilities;
            pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;
    
            if (cands.length && iceTransport.state === 'new') {
              if ((isIceLite || isComplete) &&
                  (!usingBundle || sdpMLineIndex === 0)) {
                iceTransport.setRemoteCandidates(cands);
              } else {
                cands.forEach(function(candidate) {
                  maybeAddCandidate(transceiver.iceTransport, candidate);
                });
              }
            }
    
            if (!usingBundle || sdpMLineIndex === 0) {
              if (iceTransport.state === 'new') {
                iceTransport.start(iceGatherer, remoteIceParameters,
                    'controlling');
              }
              if (dtlsTransport.state === 'new') {
                dtlsTransport.start(remoteDtlsParameters);
              }
            }
    
            // If the offer contained RTX but the answer did not,
            // remove RTX from sendEncodingParameters.
            var commonCapabilities = getCommonCapabilities(
              transceiver.localCapabilities,
              transceiver.remoteCapabilities);
    
            var hasRtx = commonCapabilities.codecs.filter(function(c) {
              return c.name.toLowerCase() === 'rtx';
            }).length;
            if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
              delete transceiver.sendEncodingParameters[0].rtx;
            }
    
            pc._transceive(transceiver,
                direction === 'sendrecv' || direction === 'recvonly',
                direction === 'sendrecv' || direction === 'sendonly');
    
            // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
            if (rtpReceiver &&
                (direction === 'sendrecv' || direction === 'sendonly')) {
              track = rtpReceiver.track;
              if (remoteMsid) {
                if (!streams[remoteMsid.stream]) {
                  streams[remoteMsid.stream] = new window.MediaStream();
                }
                addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
                receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
              } else {
                if (!streams.default) {
                  streams.default = new window.MediaStream();
                }
                addTrackToStreamAndFireEvent(track, streams.default);
                receiverList.push([track, rtpReceiver, streams.default]);
              }
            } else {
              // FIXME: actually the receiver should be created later.
              delete transceiver.rtpReceiver;
            }
          }
        });
    
        if (pc._dtlsRole === undefined) {
          pc._dtlsRole = description.type === 'offer' ? 'active' : 'passive';
        }
    
        pc._remoteDescription = {
          type: description.type,
          sdp: description.sdp
        };
        if (description.type === 'offer') {
          pc._updateSignalingState('have-remote-offer');
        } else {
          pc._updateSignalingState('stable');
        }
        Object.keys(streams).forEach(function(sid) {
          var stream = streams[sid];
          if (stream.getTracks().length) {
            if (pc.remoteStreams.indexOf(stream) === -1) {
              pc.remoteStreams.push(stream);
              var event = new Event('addstream');
              event.stream = stream;
              window.setTimeout(function() {
                pc._dispatchEvent('addstream', event);
              });
            }
    
            receiverList.forEach(function(item) {
              var track = item[0];
              var receiver = item[1];
              if (stream.id !== item[2].id) {
                return;
              }
              fireAddTrack(pc, track, receiver, [stream]);
            });
          }
        });
        receiverList.forEach(function(item) {
          if (item[2]) {
            return;
          }
          fireAddTrack(pc, item[0], item[1], []);
        });
    
        // check whether addIceCandidate({}) was called within four seconds after
        // setRemoteDescription.
        window.setTimeout(function() {
          if (!(pc && pc.transceivers)) {
            return;
          }
          pc.transceivers.forEach(function(transceiver) {
            if (transceiver.iceTransport &&
                transceiver.iceTransport.state === 'new' &&
                transceiver.iceTransport.getRemoteCandidates().length > 0) {
              console.warn('Timeout for addRemoteCandidate. Consider sending ' +
                  'an end-of-candidates notification');
              transceiver.iceTransport.addRemoteCandidate({});
            }
          });
        }, 4000);
    
        return Promise.resolve();
      };
    
      RTCPeerConnection.prototype.close = function() {
        this.transceivers.forEach(function(transceiver) {
          /* not yet
          if (transceiver.iceGatherer) {
            transceiver.iceGatherer.close();
          }
          */
          if (transceiver.iceTransport) {
            transceiver.iceTransport.stop();
          }
          if (transceiver.dtlsTransport) {
            transceiver.dtlsTransport.stop();
          }
          if (transceiver.rtpSender) {
            transceiver.rtpSender.stop();
          }
          if (transceiver.rtpReceiver) {
            transceiver.rtpReceiver.stop();
          }
        });
        // FIXME: clean up tracks, local streams, remote streams, etc
        this._isClosed = true;
        this._updateSignalingState('closed');
      };
    
      // Update the signaling state.
      RTCPeerConnection.prototype._updateSignalingState = function(newState) {
        this.signalingState = newState;
        var event = new Event('signalingstatechange');
        this._dispatchEvent('signalingstatechange', event);
      };
    
      // Determine whether to fire the negotiationneeded event.
      RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
        var pc = this;
        if (this.signalingState !== 'stable' || this.needNegotiation === true) {
          return;
        }
        this.needNegotiation = true;
        window.setTimeout(function() {
          if (pc.needNegotiation) {
            pc.needNegotiation = false;
            var event = new Event('negotiationneeded');
            pc._dispatchEvent('negotiationneeded', event);
          }
        }, 0);
      };
    
      // Update the ice connection state.
      RTCPeerConnection.prototype._updateIceConnectionState = function() {
        var newState;
        var states = {
          'new': 0,
          closed: 0,
          checking: 0,
          connected: 0,
          completed: 0,
          disconnected: 0,
          failed: 0
        };
        this.transceivers.forEach(function(transceiver) {
          if (transceiver.iceTransport && !transceiver.rejected) {
            states[transceiver.iceTransport.state]++;
          }
        });
    
        newState = 'new';
        if (states.failed > 0) {
          newState = 'failed';
        } else if (states.checking > 0) {
          newState = 'checking';
        } else if (states.disconnected > 0) {
          newState = 'disconnected';
        } else if (states.new > 0) {
          newState = 'new';
        } else if (states.connected > 0) {
          newState = 'connected';
        } else if (states.completed > 0) {
          newState = 'completed';
        }
    
        if (newState !== this.iceConnectionState) {
          this.iceConnectionState = newState;
          var event = new Event('iceconnectionstatechange');
          this._dispatchEvent('iceconnectionstatechange', event);
        }
      };
    
      // Update the connection state.
      RTCPeerConnection.prototype._updateConnectionState = function() {
        var newState;
        var states = {
          'new': 0,
          closed: 0,
          connecting: 0,
          connected: 0,
          completed: 0,
          disconnected: 0,
          failed: 0
        };
        this.transceivers.forEach(function(transceiver) {
          if (transceiver.iceTransport && transceiver.dtlsTransport &&
              !transceiver.rejected) {
            states[transceiver.iceTransport.state]++;
            states[transceiver.dtlsTransport.state]++;
          }
        });
        // ICETransport.completed and connected are the same for this purpose.
        states.connected += states.completed;
    
        newState = 'new';
        if (states.failed > 0) {
          newState = 'failed';
        } else if (states.connecting > 0) {
          newState = 'connecting';
        } else if (states.disconnected > 0) {
          newState = 'disconnected';
        } else if (states.new > 0) {
          newState = 'new';
        } else if (states.connected > 0) {
          newState = 'connected';
        }
    
        if (newState !== this.connectionState) {
          this.connectionState = newState;
          var event = new Event('connectionstatechange');
          this._dispatchEvent('connectionstatechange', event);
        }
      };
    
      RTCPeerConnection.prototype.createOffer = function() {
        var pc = this;
    
        if (pc._isClosed) {
          return Promise.reject(makeError('InvalidStateError',
              'Can not call createOffer after close'));
        }
    
        var numAudioTracks = pc.transceivers.filter(function(t) {
          return t.kind === 'audio';
        }).length;
        var numVideoTracks = pc.transceivers.filter(function(t) {
          return t.kind === 'video';
        }).length;
    
        // Determine number of audio and video tracks we need to send/recv.
        var offerOptions = arguments[0];
        if (offerOptions) {
          // Reject Chrome legacy constraints.
          if (offerOptions.mandatory || offerOptions.optional) {
            throw new TypeError(
                'Legacy mandatory/optional constraints not supported.');
          }
          if (offerOptions.offerToReceiveAudio !== undefined) {
            if (offerOptions.offerToReceiveAudio === true) {
              numAudioTracks = 1;
            } else if (offerOptions.offerToReceiveAudio === false) {
              numAudioTracks = 0;
            } else {
              numAudioTracks = offerOptions.offerToReceiveAudio;
            }
          }
          if (offerOptions.offerToReceiveVideo !== undefined) {
            if (offerOptions.offerToReceiveVideo === true) {
              numVideoTracks = 1;
            } else if (offerOptions.offerToReceiveVideo === false) {
              numVideoTracks = 0;
            } else {
              numVideoTracks = offerOptions.offerToReceiveVideo;
            }
          }
        }
    
        pc.transceivers.forEach(function(transceiver) {
          if (transceiver.kind === 'audio') {
            numAudioTracks--;
            if (numAudioTracks < 0) {
              transceiver.wantReceive = false;
            }
          } else if (transceiver.kind === 'video') {
            numVideoTracks--;
            if (numVideoTracks < 0) {
              transceiver.wantReceive = false;
            }
          }
        });
    
        // Create M-lines for recvonly streams.
        while (numAudioTracks > 0 || numVideoTracks > 0) {
          if (numAudioTracks > 0) {
            pc._createTransceiver('audio');
            numAudioTracks--;
          }
          if (numVideoTracks > 0) {
            pc._createTransceiver('video');
            numVideoTracks--;
          }
        }
    
        var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId,
            pc._sdpSessionVersion++);
        pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
          // For each track, create an ice gatherer, ice transport,
          // dtls transport, potentially rtpsender and rtpreceiver.
          var track = transceiver.track;
          var kind = transceiver.kind;
          var mid = transceiver.mid || SDPUtils.generateIdentifier();
          transceiver.mid = mid;
    
          if (!transceiver.iceGatherer) {
            transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
                pc.usingBundle);
          }
    
          var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
          // filter RTX until additional stuff needed for RTX is implemented
          // in adapter.js
          if (edgeVersion < 15019) {
            localCapabilities.codecs = localCapabilities.codecs.filter(
                function(codec) {
                  return codec.name !== 'rtx';
                });
          }
          localCapabilities.codecs.forEach(function(codec) {
            // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
            // by adding level-asymmetry-allowed=1
            if (codec.name === 'H264' &&
                codec.parameters['level-asymmetry-allowed'] === undefined) {
              codec.parameters['level-asymmetry-allowed'] = '1';
            }
    
            // for subsequent offers, we might have to re-use the payload
            // type of the last offer.
            if (transceiver.remoteCapabilities &&
                transceiver.remoteCapabilities.codecs) {
              transceiver.remoteCapabilities.codecs.forEach(function(remoteCodec) {
                if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() &&
                    codec.clockRate === remoteCodec.clockRate) {
                  codec.preferredPayloadType = remoteCodec.payloadType;
                }
              });
            }
          });
          localCapabilities.headerExtensions.forEach(function(hdrExt) {
            var remoteExtensions = transceiver.remoteCapabilities &&
                transceiver.remoteCapabilities.headerExtensions || [];
            remoteExtensions.forEach(function(rHdrExt) {
              if (hdrExt.uri === rHdrExt.uri) {
                hdrExt.id = rHdrExt.id;
              }
            });
          });
    
          // generate an ssrc now, to be used later in rtpSender.send
          var sendEncodingParameters = transceiver.sendEncodingParameters || [{
            ssrc: (2 * sdpMLineIndex + 1) * 1001
          }];
          if (track) {
            // add RTX
            if (edgeVersion >= 15019 && kind === 'video' &&
                !sendEncodingParameters[0].rtx) {
              sendEncodingParameters[0].rtx = {
                ssrc: sendEncodingParameters[0].ssrc + 1
              };
            }
          }
    
          if (transceiver.wantReceive) {
            transceiver.rtpReceiver = new window.RTCRtpReceiver(
                transceiver.dtlsTransport, kind);
          }
    
          transceiver.localCapabilities = localCapabilities;
          transceiver.sendEncodingParameters = sendEncodingParameters;
        });
    
        // always offer BUNDLE and dispose on return if not supported.
        if (pc._config.bundlePolicy !== 'max-compat') {
          sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
            return t.mid;
          }).join(' ') + '\r\n';
        }
        sdp += 'a=ice-options:trickle\r\n';
    
        pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
          sdp += writeMediaSection(transceiver, transceiver.localCapabilities,
              'offer', transceiver.stream, pc._dtlsRole);
          sdp += 'a=rtcp-rsize\r\n';
    
          if (transceiver.iceGatherer && pc.iceGatheringState !== 'new' &&
              (sdpMLineIndex === 0 || !pc.usingBundle)) {
            transceiver.iceGatherer.getLocalCandidates().forEach(function(cand) {
              cand.component = 1;
              sdp += 'a=' + SDPUtils.writeCandidate(cand) + '\r\n';
            });
    
            if (transceiver.iceGatherer.state === 'completed') {
              sdp += 'a=end-of-candidates\r\n';
            }
          }
        });
    
        var desc = new window.RTCSessionDescription({
          type: 'offer',
          sdp: sdp
        });
        return Promise.resolve(desc);
      };
    
      RTCPeerConnection.prototype.createAnswer = function() {
        var pc = this;
    
        if (pc._isClosed) {
          return Promise.reject(makeError('InvalidStateError',
              'Can not call createAnswer after close'));
        }
    
        if (!(pc.signalingState === 'have-remote-offer' ||
            pc.signalingState === 'have-local-pranswer')) {
          return Promise.reject(makeError('InvalidStateError',
              'Can not call createAnswer in signalingState ' + pc.signalingState));
        }
    
        var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId,
            pc._sdpSessionVersion++);
        if (pc.usingBundle) {
          sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
            return t.mid;
          }).join(' ') + '\r\n';
        }
        sdp += 'a=ice-options:trickle\r\n';
    
        var mediaSectionsInOffer = SDPUtils.getMediaSections(
            pc._remoteDescription.sdp).length;
        pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
          if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
            return;
          }
          if (transceiver.rejected) {
            if (transceiver.kind === 'application') {
              if (transceiver.protocol === 'DTLS/SCTP') { // legacy fmt
                sdp += 'm=application 0 DTLS/SCTP 5000\r\n';
              } else {
                sdp += 'm=application 0 ' + transceiver.protocol +
                    ' webrtc-datachannel\r\n';
              }
            } else if (transceiver.kind === 'audio') {
              sdp += 'm=audio 0 UDP/TLS/RTP/SAVPF 0\r\n' +
                  'a=rtpmap:0 PCMU/8000\r\n';
            } else if (transceiver.kind === 'video') {
              sdp += 'm=video 0 UDP/TLS/RTP/SAVPF 120\r\n' +
                  'a=rtpmap:120 VP8/90000\r\n';
            }
            sdp += 'c=IN IP4 0.0.0.0\r\n' +
                'a=inactive\r\n' +
                'a=mid:' + transceiver.mid + '\r\n';
            return;
          }
    
          // FIXME: look at direction.
          if (transceiver.stream) {
            var localTrack;
            if (transceiver.kind === 'audio') {
              localTrack = transceiver.stream.getAudioTracks()[0];
            } else if (transceiver.kind === 'video') {
              localTrack = transceiver.stream.getVideoTracks()[0];
            }
            if (localTrack) {
              // add RTX
              if (edgeVersion >= 15019 && transceiver.kind === 'video' &&
                  !transceiver.sendEncodingParameters[0].rtx) {
                transceiver.sendEncodingParameters[0].rtx = {
                  ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
                };
              }
            }
          }
    
          // Calculate intersection of capabilities.
          var commonCapabilities = getCommonCapabilities(
              transceiver.localCapabilities,
              transceiver.remoteCapabilities);
    
          var hasRtx = commonCapabilities.codecs.filter(function(c) {
            return c.name.toLowerCase() === 'rtx';
          }).length;
          if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
            delete transceiver.sendEncodingParameters[0].rtx;
          }
    
          sdp += writeMediaSection(transceiver, commonCapabilities,
              'answer', transceiver.stream, pc._dtlsRole);
          if (transceiver.rtcpParameters &&
              transceiver.rtcpParameters.reducedSize) {
            sdp += 'a=rtcp-rsize\r\n';
          }
        });
    
        var desc = new window.RTCSessionDescription({
          type: 'answer',
          sdp: sdp
        });
        return Promise.resolve(desc);
      };
    
      RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
        var pc = this;
        var sections;
        if (candidate && !(candidate.sdpMLineIndex !== undefined ||
            candidate.sdpMid)) {
          return Promise.reject(new TypeError('sdpMLineIndex or sdpMid required'));
        }
    
        // TODO: needs to go into ops queue.
        return new Promise(function(resolve, reject) {
          if (!pc._remoteDescription) {
            return reject(makeError('InvalidStateError',
                'Can not add ICE candidate without a remote description'));
          } else if (!candidate || candidate.candidate === '') {
            for (var j = 0; j < pc.transceivers.length; j++) {
              if (pc.transceivers[j].rejected) {
                continue;
              }
              pc.transceivers[j].iceTransport.addRemoteCandidate({});
              sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
              sections[j] += 'a=end-of-candidates\r\n';
              pc._remoteDescription.sdp =
                  SDPUtils.getDescription(pc._remoteDescription.sdp) +
                  sections.join('');
              if (pc.usingBundle) {
                break;
              }
            }
          } else {
            var sdpMLineIndex = candidate.sdpMLineIndex;
            if (candidate.sdpMid) {
              for (var i = 0; i < pc.transceivers.length; i++) {
                if (pc.transceivers[i].mid === candidate.sdpMid) {
                  sdpMLineIndex = i;
                  break;
                }
              }
            }
            var transceiver = pc.transceivers[sdpMLineIndex];
            if (transceiver) {
              if (transceiver.rejected) {
                return resolve();
              }
              var cand = Object.keys(candidate.candidate).length > 0 ?
                  SDPUtils.parseCandidate(candidate.candidate) : {};
              // Ignore Chrome's invalid candidates since Edge does not like them.
              if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
                return resolve();
              }
              // Ignore RTCP candidates, we assume RTCP-MUX.
              if (cand.component && cand.component !== 1) {
                return resolve();
              }
              // when using bundle, avoid adding candidates to the wrong
              // ice transport. And avoid adding candidates added in the SDP.
              if (sdpMLineIndex === 0 || (sdpMLineIndex > 0 &&
                  transceiver.iceTransport !== pc.transceivers[0].iceTransport)) {
                if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
                  return reject(makeError('OperationError',
                      'Can not add ICE candidate'));
                }
              }
    
              // update the remoteDescription.
              var candidateString = candidate.candidate.trim();
              if (candidateString.indexOf('a=') === 0) {
                candidateString = candidateString.substr(2);
              }
              sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
              sections[sdpMLineIndex] += 'a=' +
                  (cand.type ? candidateString : 'end-of-candidates')
                  + '\r\n';
              pc._remoteDescription.sdp =
                  SDPUtils.getDescription(pc._remoteDescription.sdp) +
                  sections.join('');
            } else {
              return reject(makeError('OperationError',
                  'Can not add ICE candidate'));
            }
          }
          resolve();
        });
      };
    
      RTCPeerConnection.prototype.getStats = function(selector) {
        if (selector && selector instanceof window.MediaStreamTrack) {
          var senderOrReceiver = null;
          this.transceivers.forEach(function(transceiver) {
            if (transceiver.rtpSender &&
                transceiver.rtpSender.track === selector) {
              senderOrReceiver = transceiver.rtpSender;
            } else if (transceiver.rtpReceiver &&
                transceiver.rtpReceiver.track === selector) {
              senderOrReceiver = transceiver.rtpReceiver;
            }
          });
          if (!senderOrReceiver) {
            throw makeError('InvalidAccessError', 'Invalid selector.');
          }
          return senderOrReceiver.getStats();
        }
    
        var promises = [];
        this.transceivers.forEach(function(transceiver) {
          ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
              'dtlsTransport'].forEach(function(method) {
                if (transceiver[method]) {
                  promises.push(transceiver[method].getStats());
                }
              });
        });
        return Promise.all(promises).then(function(allStats) {
          var results = new Map();
          allStats.forEach(function(stats) {
            stats.forEach(function(stat) {
              results.set(stat.id, stat);
            });
          });
          return results;
        });
      };
    
      // fix low-level stat names and return Map instead of object.
      var ortcObjects = ['RTCRtpSender', 'RTCRtpReceiver', 'RTCIceGatherer',
        'RTCIceTransport', 'RTCDtlsTransport'];
      ortcObjects.forEach(function(ortcObjectName) {
        var obj = window[ortcObjectName];
        if (obj && obj.prototype && obj.prototype.getStats) {
          var nativeGetstats = obj.prototype.getStats;
          obj.prototype.getStats = function() {
            return nativeGetstats.apply(this)
            .then(function(nativeStats) {
              var mapStats = new Map();
              Object.keys(nativeStats).forEach(function(id) {
                nativeStats[id].type = fixStatsType(nativeStats[id]);
                mapStats.set(id, nativeStats[id]);
              });
              return mapStats;
            });
          };
        }
      });
    
      // legacy callback shims. Should be moved to adapter.js some days.
      var methods = ['createOffer', 'createAnswer'];
      methods.forEach(function(method) {
        var nativeMethod = RTCPeerConnection.prototype[method];
        RTCPeerConnection.prototype[method] = function() {
          var args = arguments;
          if (typeof args[0] === 'function' ||
              typeof args[1] === 'function') { // legacy
            return nativeMethod.apply(this, [arguments[2]])
            .then(function(description) {
              if (typeof args[0] === 'function') {
                args[0].apply(null, [description]);
              }
            }, function(error) {
              if (typeof args[1] === 'function') {
                args[1].apply(null, [error]);
              }
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });
    
      methods = ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'];
      methods.forEach(function(method) {
        var nativeMethod = RTCPeerConnection.prototype[method];
        RTCPeerConnection.prototype[method] = function() {
          var args = arguments;
          if (typeof args[1] === 'function' ||
              typeof args[2] === 'function') { // legacy
            return nativeMethod.apply(this, arguments)
            .then(function() {
              if (typeof args[1] === 'function') {
                args[1].apply(null);
              }
            }, function(error) {
              if (typeof args[2] === 'function') {
                args[2].apply(null, [error]);
              }
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });
    
      // getStats is special. It doesn't have a spec legacy method yet we support
      // getStats(something, cb) without error callbacks.
      ['getStats'].forEach(function(method) {
        var nativeMethod = RTCPeerConnection.prototype[method];
        RTCPeerConnection.prototype[method] = function() {
          var args = arguments;
          if (typeof args[1] === 'function') {
            return nativeMethod.apply(this, arguments)
            .then(function() {
              if (typeof args[1] === 'function') {
                args[1].apply(null);
              }
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });
    
      return RTCPeerConnection;
    };
    
    },{"sdp":17}],17:[function(require,module,exports){
     /* eslint-env node */
    'use strict';
    
    // SDP helpers.
    var SDPUtils = {};
    
    // Generate an alphanumeric identifier for cname or mids.
    // TODO: use UUIDs instead? https://gist.github.com/jed/982883
    SDPUtils.generateIdentifier = function() {
      return Math.random().toString(36).substr(2, 10);
    };
    
    // The RTCP CNAME used by all peerconnections from the same JS.
    SDPUtils.localCName = SDPUtils.generateIdentifier();
    
    // Splits SDP into lines, dealing with both CRLF and LF.
    SDPUtils.splitLines = function(blob) {
      return blob.trim().split('\n').map(function(line) {
        return line.trim();
      });
    };
    // Splits SDP into sessionpart and mediasections. Ensures CRLF.
    SDPUtils.splitSections = function(blob) {
      var parts = blob.split('\nm=');
      return parts.map(function(part, index) {
        return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
      });
    };
    
    // returns the session description.
    SDPUtils.getDescription = function(blob) {
      var sections = SDPUtils.splitSections(blob);
      return sections && sections[0];
    };
    
    // returns the individual media sections.
    SDPUtils.getMediaSections = function(blob) {
      var sections = SDPUtils.splitSections(blob);
      sections.shift();
      return sections;
    };
    
    // Returns lines that start with a certain prefix.
    SDPUtils.matchPrefix = function(blob, prefix) {
      return SDPUtils.splitLines(blob).filter(function(line) {
        return line.indexOf(prefix) === 0;
      });
    };
    
    // Parses an ICE candidate line. Sample input:
    // candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
    // rport 55996"
    SDPUtils.parseCandidate = function(line) {
      var parts;
      // Parse both variants.
      if (line.indexOf('a=candidate:') === 0) {
        parts = line.substring(12).split(' ');
      } else {
        parts = line.substring(10).split(' ');
      }
    
      var candidate = {
        foundation: parts[0],
        component: parseInt(parts[1], 10),
        protocol: parts[2].toLowerCase(),
        priority: parseInt(parts[3], 10),
        ip: parts[4],
        address: parts[4], // address is an alias for ip.
        port: parseInt(parts[5], 10),
        // skip parts[6] == 'typ'
        type: parts[7]
      };
    
      for (var i = 8; i < parts.length; i += 2) {
        switch (parts[i]) {
          case 'raddr':
            candidate.relatedAddress = parts[i + 1];
            break;
          case 'rport':
            candidate.relatedPort = parseInt(parts[i + 1], 10);
            break;
          case 'tcptype':
            candidate.tcpType = parts[i + 1];
            break;
          case 'ufrag':
            candidate.ufrag = parts[i + 1]; // for backward compability.
            candidate.usernameFragment = parts[i + 1];
            break;
          default: // extension handling, in particular ufrag
            candidate[parts[i]] = parts[i + 1];
            break;
        }
      }
      return candidate;
    };
    
    // Translates a candidate object into SDP candidate attribute.
    SDPUtils.writeCandidate = function(candidate) {
      var sdp = [];
      sdp.push(candidate.foundation);
      sdp.push(candidate.component);
      sdp.push(candidate.protocol.toUpperCase());
      sdp.push(candidate.priority);
      sdp.push(candidate.address || candidate.ip);
      sdp.push(candidate.port);
    
      var type = candidate.type;
      sdp.push('typ');
      sdp.push(type);
      if (type !== 'host' && candidate.relatedAddress &&
          candidate.relatedPort) {
        sdp.push('raddr');
        sdp.push(candidate.relatedAddress);
        sdp.push('rport');
        sdp.push(candidate.relatedPort);
      }
      if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
        sdp.push('tcptype');
        sdp.push(candidate.tcpType);
      }
      if (candidate.usernameFragment || candidate.ufrag) {
        sdp.push('ufrag');
        sdp.push(candidate.usernameFragment || candidate.ufrag);
      }
      return 'candidate:' + sdp.join(' ');
    };
    
    // Parses an ice-options line, returns an array of option tags.
    // a=ice-options:foo bar
    SDPUtils.parseIceOptions = function(line) {
      return line.substr(14).split(' ');
    };
    
    // Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
    // a=rtpmap:111 opus/48000/2
    SDPUtils.parseRtpMap = function(line) {
      var parts = line.substr(9).split(' ');
      var parsed = {
        payloadType: parseInt(parts.shift(), 10) // was: id
      };
    
      parts = parts[0].split('/');
    
      parsed.name = parts[0];
      parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
      parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
      // legacy alias, got renamed back to channels in ORTC.
      parsed.numChannels = parsed.channels;
      return parsed;
    };
    
    // Generate an a=rtpmap line from RTCRtpCodecCapability or
    // RTCRtpCodecParameters.
    SDPUtils.writeRtpMap = function(codec) {
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      var channels = codec.channels || codec.numChannels || 1;
      return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
          (channels !== 1 ? '/' + channels : '') + '\r\n';
    };
    
    // Parses an a=extmap line (headerextension from RFC 5285). Sample input:
    // a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
    // a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
    SDPUtils.parseExtmap = function(line) {
      var parts = line.substr(9).split(' ');
      return {
        id: parseInt(parts[0], 10),
        direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
        uri: parts[1]
      };
    };
    
    // Generates a=extmap line from RTCRtpHeaderExtensionParameters or
    // RTCRtpHeaderExtension.
    SDPUtils.writeExtmap = function(headerExtension) {
      return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
          (headerExtension.direction && headerExtension.direction !== 'sendrecv'
              ? '/' + headerExtension.direction
              : '') +
          ' ' + headerExtension.uri + '\r\n';
    };
    
    // Parses an ftmp line, returns dictionary. Sample input:
    // a=fmtp:96 vbr=on;cng=on
    // Also deals with vbr=on; cng=on
    SDPUtils.parseFmtp = function(line) {
      var parsed = {};
      var kv;
      var parts = line.substr(line.indexOf(' ') + 1).split(';');
      for (var j = 0; j < parts.length; j++) {
        kv = parts[j].trim().split('=');
        parsed[kv[0].trim()] = kv[1];
      }
      return parsed;
    };
    
    // Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
    SDPUtils.writeFmtp = function(codec) {
      var line = '';
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      if (codec.parameters && Object.keys(codec.parameters).length) {
        var params = [];
        Object.keys(codec.parameters).forEach(function(param) {
          if (codec.parameters[param]) {
            params.push(param + '=' + codec.parameters[param]);
          } else {
            params.push(param);
          }
        });
        line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
      }
      return line;
    };
    
    // Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
    // a=rtcp-fb:98 nack rpsi
    SDPUtils.parseRtcpFb = function(line) {
      var parts = line.substr(line.indexOf(' ') + 1).split(' ');
      return {
        type: parts.shift(),
        parameter: parts.join(' ')
      };
    };
    // Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
    SDPUtils.writeRtcpFb = function(codec) {
      var lines = '';
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
        // FIXME: special handling for trr-int?
        codec.rtcpFeedback.forEach(function(fb) {
          lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
          (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
              '\r\n';
        });
      }
      return lines;
    };
    
    // Parses an RFC 5576 ssrc media attribute. Sample input:
    // a=ssrc:3735928559 cname:something
    SDPUtils.parseSsrcMedia = function(line) {
      var sp = line.indexOf(' ');
      var parts = {
        ssrc: parseInt(line.substr(7, sp - 7), 10)
      };
      var colon = line.indexOf(':', sp);
      if (colon > -1) {
        parts.attribute = line.substr(sp + 1, colon - sp - 1);
        parts.value = line.substr(colon + 1);
      } else {
        parts.attribute = line.substr(sp + 1);
      }
      return parts;
    };
    
    SDPUtils.parseSsrcGroup = function(line) {
      var parts = line.substr(13).split(' ');
      return {
        semantics: parts.shift(),
        ssrcs: parts.map(function(ssrc) {
          return parseInt(ssrc, 10);
        })
      };
    };
    
    // Extracts the MID (RFC 5888) from a media section.
    // returns the MID or undefined if no mid line was found.
    SDPUtils.getMid = function(mediaSection) {
      var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
      if (mid) {
        return mid.substr(6);
      }
    };
    
    SDPUtils.parseFingerprint = function(line) {
      var parts = line.substr(14).split(' ');
      return {
        algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
        value: parts[1]
      };
    };
    
    // Extracts DTLS parameters from SDP media section or sessionpart.
    // FIXME: for consistency with other functions this should only
    //   get the fingerprint line as input. See also getIceParameters.
    SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
      var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
          'a=fingerprint:');
      // Note: a=setup line is ignored since we use the 'auto' role.
      // Note2: 'algorithm' is not case sensitive except in Edge.
      return {
        role: 'auto',
        fingerprints: lines.map(SDPUtils.parseFingerprint)
      };
    };
    
    // Serializes DTLS parameters to SDP.
    SDPUtils.writeDtlsParameters = function(params, setupType) {
      var sdp = 'a=setup:' + setupType + '\r\n';
      params.fingerprints.forEach(function(fp) {
        sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
      });
      return sdp;
    };
    // Parses ICE information from SDP media section or sessionpart.
    // FIXME: for consistency with other functions this should only
    //   get the ice-ufrag and ice-pwd lines as input.
    SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
      var lines = SDPUtils.splitLines(mediaSection);
      // Search in session part, too.
      lines = lines.concat(SDPUtils.splitLines(sessionpart));
      var iceParameters = {
        usernameFragment: lines.filter(function(line) {
          return line.indexOf('a=ice-ufrag:') === 0;
        })[0].substr(12),
        password: lines.filter(function(line) {
          return line.indexOf('a=ice-pwd:') === 0;
        })[0].substr(10)
      };
      return iceParameters;
    };
    
    // Serializes ICE parameters to SDP.
    SDPUtils.writeIceParameters = function(params) {
      return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
          'a=ice-pwd:' + params.password + '\r\n';
    };
    
    // Parses the SDP media section and returns RTCRtpParameters.
    SDPUtils.parseRtpParameters = function(mediaSection) {
      var description = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: [],
        rtcp: []
      };
      var lines = SDPUtils.splitLines(mediaSection);
      var mline = lines[0].split(' ');
      for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
        var pt = mline[i];
        var rtpmapline = SDPUtils.matchPrefix(
            mediaSection, 'a=rtpmap:' + pt + ' ')[0];
        if (rtpmapline) {
          var codec = SDPUtils.parseRtpMap(rtpmapline);
          var fmtps = SDPUtils.matchPrefix(
              mediaSection, 'a=fmtp:' + pt + ' ');
          // Only the first a=fmtp:<pt> is considered.
          codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
          codec.rtcpFeedback = SDPUtils.matchPrefix(
              mediaSection, 'a=rtcp-fb:' + pt + ' ')
            .map(SDPUtils.parseRtcpFb);
          description.codecs.push(codec);
          // parse FEC mechanisms from rtpmap lines.
          switch (codec.name.toUpperCase()) {
            case 'RED':
            case 'ULPFEC':
              description.fecMechanisms.push(codec.name.toUpperCase());
              break;
            default: // only RED and ULPFEC are recognized as FEC mechanisms.
              break;
          }
        }
      }
      SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
        description.headerExtensions.push(SDPUtils.parseExtmap(line));
      });
      // FIXME: parse rtcp.
      return description;
    };
    
    // Generates parts of the SDP media section describing the capabilities /
    // parameters.
    SDPUtils.writeRtpDescription = function(kind, caps) {
      var sdp = '';
    
      // Build the mline.
      sdp += 'm=' + kind + ' ';
      sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
      sdp += ' UDP/TLS/RTP/SAVPF ';
      sdp += caps.codecs.map(function(codec) {
        if (codec.preferredPayloadType !== undefined) {
          return codec.preferredPayloadType;
        }
        return codec.payloadType;
      }).join(' ') + '\r\n';
    
      sdp += 'c=IN IP4 0.0.0.0\r\n';
      sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';
    
      // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
      caps.codecs.forEach(function(codec) {
        sdp += SDPUtils.writeRtpMap(codec);
        sdp += SDPUtils.writeFmtp(codec);
        sdp += SDPUtils.writeRtcpFb(codec);
      });
      var maxptime = 0;
      caps.codecs.forEach(function(codec) {
        if (codec.maxptime > maxptime) {
          maxptime = codec.maxptime;
        }
      });
      if (maxptime > 0) {
        sdp += 'a=maxptime:' + maxptime + '\r\n';
      }
      sdp += 'a=rtcp-mux\r\n';
    
      if (caps.headerExtensions) {
        caps.headerExtensions.forEach(function(extension) {
          sdp += SDPUtils.writeExtmap(extension);
        });
      }
      // FIXME: write fecMechanisms.
      return sdp;
    };
    
    // Parses the SDP media section and returns an array of
    // RTCRtpEncodingParameters.
    SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
      var encodingParameters = [];
      var description = SDPUtils.parseRtpParameters(mediaSection);
      var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
      var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;
    
      // filter a=ssrc:... cname:, ignore PlanB-msid
      var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
      .map(function(line) {
        return SDPUtils.parseSsrcMedia(line);
      })
      .filter(function(parts) {
        return parts.attribute === 'cname';
      });
      var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
      var secondarySsrc;
    
      var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
      .map(function(line) {
        var parts = line.substr(17).split(' ');
        return parts.map(function(part) {
          return parseInt(part, 10);
        });
      });
      if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
        secondarySsrc = flows[0][1];
      }
    
      description.codecs.forEach(function(codec) {
        if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
          var encParam = {
            ssrc: primarySsrc,
            codecPayloadType: parseInt(codec.parameters.apt, 10)
          };
          if (primarySsrc && secondarySsrc) {
            encParam.rtx = {ssrc: secondarySsrc};
          }
          encodingParameters.push(encParam);
          if (hasRed) {
            encParam = JSON.parse(JSON.stringify(encParam));
            encParam.fec = {
              ssrc: primarySsrc,
              mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
            };
            encodingParameters.push(encParam);
          }
        }
      });
      if (encodingParameters.length === 0 && primarySsrc) {
        encodingParameters.push({
          ssrc: primarySsrc
        });
      }
    
      // we support both b=AS and b=TIAS but interpret AS as TIAS.
      var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
      if (bandwidth.length) {
        if (bandwidth[0].indexOf('b=TIAS:') === 0) {
          bandwidth = parseInt(bandwidth[0].substr(7), 10);
        } else if (bandwidth[0].indexOf('b=AS:') === 0) {
          // use formula from JSEP to convert b=AS to TIAS value.
          bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95
              - (50 * 40 * 8);
        } else {
          bandwidth = undefined;
        }
        encodingParameters.forEach(function(params) {
          params.maxBitrate = bandwidth;
        });
      }
      return encodingParameters;
    };
    
    // parses http://draft.ortc.org/#rtcrtcpparameters*
    SDPUtils.parseRtcpParameters = function(mediaSection) {
      var rtcpParameters = {};
    
      // Gets the first SSRC. Note tha with RTX there might be multiple
      // SSRCs.
      var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
          .map(function(line) {
            return SDPUtils.parseSsrcMedia(line);
          })
          .filter(function(obj) {
            return obj.attribute === 'cname';
          })[0];
      if (remoteSsrc) {
        rtcpParameters.cname = remoteSsrc.value;
        rtcpParameters.ssrc = remoteSsrc.ssrc;
      }
    
      // Edge uses the compound attribute instead of reducedSize
      // compound is !reducedSize
      var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
      rtcpParameters.reducedSize = rsize.length > 0;
      rtcpParameters.compound = rsize.length === 0;
    
      // parses the rtcp-mux attrÑ–bute.
      // Note that Edge does not support unmuxed RTCP.
      var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
      rtcpParameters.mux = mux.length > 0;
    
      return rtcpParameters;
    };
    
    // parses either a=msid: or a=ssrc:... msid lines and returns
    // the id of the MediaStream and MediaStreamTrack.
    SDPUtils.parseMsid = function(mediaSection) {
      var parts;
      var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
      if (spec.length === 1) {
        parts = spec[0].substr(7).split(' ');
        return {stream: parts[0], track: parts[1]};
      }
      var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
      .map(function(line) {
        return SDPUtils.parseSsrcMedia(line);
      })
      .filter(function(msidParts) {
        return msidParts.attribute === 'msid';
      });
      if (planB.length > 0) {
        parts = planB[0].value.split(' ');
        return {stream: parts[0], track: parts[1]};
      }
    };
    
    // Generate a session ID for SDP.
    // https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
    // recommends using a cryptographically random +ve 64-bit value
    // but right now this should be acceptable and within the right range
    SDPUtils.generateSessionId = function() {
      return Math.random().toString().substr(2, 21);
    };
    
    // Write boilder plate for start of SDP
    // sessId argument is optional - if not supplied it will
    // be generated randomly
    // sessVersion is optional and defaults to 2
    // sessUser is optional and defaults to 'thisisadapterortc'
    SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
      var sessionId;
      var version = sessVer !== undefined ? sessVer : 2;
      if (sessId) {
        sessionId = sessId;
      } else {
        sessionId = SDPUtils.generateSessionId();
      }
      var user = sessUser || 'thisisadapterortc';
      // FIXME: sess-id should be an NTP timestamp.
      return 'v=0\r\n' +
          'o=' + user + ' ' + sessionId + ' ' + version +
            ' IN IP4 127.0.0.1\r\n' +
          's=-\r\n' +
          't=0 0\r\n';
    };
    
    SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
      var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);
    
      // Map ICE parameters (ufrag, pwd) to SDP.
      sdp += SDPUtils.writeIceParameters(
          transceiver.iceGatherer.getLocalParameters());
    
      // Map DTLS parameters to SDP.
      sdp += SDPUtils.writeDtlsParameters(
          transceiver.dtlsTransport.getLocalParameters(),
          type === 'offer' ? 'actpass' : 'active');
    
      sdp += 'a=mid:' + transceiver.mid + '\r\n';
    
      if (transceiver.direction) {
        sdp += 'a=' + transceiver.direction + '\r\n';
      } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
        sdp += 'a=sendrecv\r\n';
      } else if (transceiver.rtpSender) {
        sdp += 'a=sendonly\r\n';
      } else if (transceiver.rtpReceiver) {
        sdp += 'a=recvonly\r\n';
      } else {
        sdp += 'a=inactive\r\n';
      }
    
      if (transceiver.rtpSender) {
        // spec.
        var msid = 'msid:' + stream.id + ' ' +
            transceiver.rtpSender.track.id + '\r\n';
        sdp += 'a=' + msid;
    
        // for Chrome.
        sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
            ' ' + msid;
        if (transceiver.sendEncodingParameters[0].rtx) {
          sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
              ' ' + msid;
          sdp += 'a=ssrc-group:FID ' +
              transceiver.sendEncodingParameters[0].ssrc + ' ' +
              transceiver.sendEncodingParameters[0].rtx.ssrc +
              '\r\n';
        }
      }
      // FIXME: this should be written by writeRtpDescription.
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
          ' cname:' + SDPUtils.localCName + '\r\n';
      if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
        sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
            ' cname:' + SDPUtils.localCName + '\r\n';
      }
      return sdp;
    };
    
    // Gets the direction from the mediaSection or the sessionpart.
    SDPUtils.getDirection = function(mediaSection, sessionpart) {
      // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
      var lines = SDPUtils.splitLines(mediaSection);
      for (var i = 0; i < lines.length; i++) {
        switch (lines[i]) {
          case 'a=sendrecv':
          case 'a=sendonly':
          case 'a=recvonly':
          case 'a=inactive':
            return lines[i].substr(2);
          default:
            // FIXME: What should happen here?
        }
      }
      if (sessionpart) {
        return SDPUtils.getDirection(sessionpart);
      }
      return 'sendrecv';
    };
    
    SDPUtils.getKind = function(mediaSection) {
      var lines = SDPUtils.splitLines(mediaSection);
      var mline = lines[0].split(' ');
      return mline[0].substr(2);
    };
    
    SDPUtils.isRejected = function(mediaSection) {
      return mediaSection.split(' ', 2)[1] === '0';
    };
    
    SDPUtils.parseMLine = function(mediaSection) {
      var lines = SDPUtils.splitLines(mediaSection);
      var parts = lines[0].substr(2).split(' ');
      return {
        kind: parts[0],
        port: parseInt(parts[1], 10),
        protocol: parts[2],
        fmt: parts.slice(3).join(' ')
      };
    };
    
    SDPUtils.parseOLine = function(mediaSection) {
      var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
      var parts = line.substr(2).split(' ');
      return {
        username: parts[0],
        sessionId: parts[1],
        sessionVersion: parseInt(parts[2], 10),
        netType: parts[3],
        addressType: parts[4],
        address: parts[5]
      };
    };
    
    // a very naive interpretation of a valid SDP.
    SDPUtils.isValidSDP = function(blob) {
      if (typeof blob !== 'string' || blob.length === 0) {
        return false;
      }
      var lines = SDPUtils.splitLines(blob);
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
          return false;
        }
        // TODO: check the modifier a bit more.
      }
      return true;
    };
    
    // Expose public methods.
    if (typeof module === 'object') {
      module.exports = SDPUtils;
    }
    
    },{}]},{},[1])(1)
    });


// __________________
// getHTMLMediaElement.js

function getHTMLMediaElement(mediaElement, config) {
    config = config || {};

    if (!mediaElement.nodeName || (mediaElement.nodeName.toLowerCase() != 'audio' && mediaElement.nodeName.toLowerCase() != 'video')) {
        if (!mediaElement.getVideoTracks().length) {
            return getAudioElement(mediaElement, config);
        }

        var mediaStream = mediaElement;
        mediaElement = document.createElement(mediaStream.getVideoTracks().length ? 'video' : 'audio');

        try {
            mediaElement.setAttributeNode(document.createAttribute('autoplay'));
            mediaElement.setAttributeNode(document.createAttribute('playsinline'));
        } catch (e) {
            mediaElement.setAttribute('autoplay', true);
            mediaElement.setAttribute('playsinline', true);
        }

        if ('srcObject' in mediaElement) {
            mediaElement.srcObject = mediaStream;
        } else {
            mediaElement[!!navigator.mozGetUserMedia ? 'mozSrcObject' : 'src'] = !!navigator.mozGetUserMedia ? mediaStream : (window.URL || window.webkitURL).createObjectURL(mediaStream);
        }
    }

    if (mediaElement.nodeName && mediaElement.nodeName.toLowerCase() == 'audio') {
        return getAudioElement(mediaElement, config);
    }

    var buttons = config.buttons || ['mute-audio', 'mute-video', 'full-screen', 'volume-slider', 'stop'];
    buttons.has = function(element) {
        return buttons.indexOf(element) !== -1;
    };

    config.toggle = config.toggle || [];
    config.toggle.has = function(element) {
        return config.toggle.indexOf(element) !== -1;
    };

    var mediaElementContainer = document.createElement('div');
    mediaElementContainer.className = 'media-container';

    var mediaControls = document.createElement('div');
    mediaControls.className = 'media-controls';
    mediaElementContainer.appendChild(mediaControls);

    if (buttons.has('mute-audio')) {
        var muteAudio = document.createElement('div');
        muteAudio.className = 'control ' + (config.toggle.has('mute-audio') ? 'unmute-audio selected' : 'mute-audio');
        mediaControls.appendChild(muteAudio);

        muteAudio.onclick = function() {
            if (muteAudio.className.indexOf('unmute-audio') != -1) {
                muteAudio.className = muteAudio.className.replace('unmute-audio selected', 'mute-audio');
                mediaElement.muted = false;
                mediaElement.volume = 1;
                if (config.onUnMuted) config.onUnMuted('audio');
            } else {
                muteAudio.className = muteAudio.className.replace('mute-audio', 'unmute-audio selected');
                mediaElement.muted = true;
                mediaElement.volume = 0;
                if (config.onMuted) config.onMuted('audio');
            }
        };
    }

    if (buttons.has('mute-video')) {
        var muteVideo = document.createElement('div');
        muteVideo.className = 'control ' + (config.toggle.has('mute-video') ? 'unmute-video selected' : 'mute-video');
        mediaControls.appendChild(muteVideo);

        muteVideo.onclick = function() {
            if (muteVideo.className.indexOf('unmute-video') != -1) {
                muteVideo.className = muteVideo.className.replace('unmute-video selected', 'mute-video');
                mediaElement.muted = false;
                mediaElement.volume = 1;
                mediaElement.play();
                if (config.onUnMuted) config.onUnMuted('video');
            } else {
                muteVideo.className = muteVideo.className.replace('mute-video', 'unmute-video selected');
                mediaElement.muted = true;
                mediaElement.volume = 0;
                mediaElement.pause();
                if (config.onMuted) config.onMuted('video');
            }
        };
    }

    if (buttons.has('take-snapshot')) {
        var takeSnapshot = document.createElement('div');
        takeSnapshot.className = 'control take-snapshot';
        mediaControls.appendChild(takeSnapshot);

        takeSnapshot.onclick = function() {
            if (config.onTakeSnapshot) config.onTakeSnapshot();
        };
    }

    if (buttons.has('stop')) {
        var stop = document.createElement('div');
        stop.className = 'control stop';
        mediaControls.appendChild(stop);

        stop.onclick = function() {
            mediaElementContainer.style.opacity = 0;
            setTimeout(function() {
                if (mediaElementContainer.parentNode) {
                    mediaElementContainer.parentNode.removeChild(mediaElementContainer);
                }
            }, 800);
            if (config.onStopped) config.onStopped();
        };
    }

    var volumeControl = document.createElement('div');
    volumeControl.className = 'volume-control';

    if (buttons.has('record-audio')) {
        var recordAudio = document.createElement('div');
        recordAudio.className = 'control ' + (config.toggle.has('record-audio') ? 'stop-recording-audio selected' : 'record-audio');
        volumeControl.appendChild(recordAudio);

        recordAudio.onclick = function() {
            if (recordAudio.className.indexOf('stop-recording-audio') != -1) {
                recordAudio.className = recordAudio.className.replace('stop-recording-audio selected', 'record-audio');
                if (config.onRecordingStopped) config.onRecordingStopped('audio');
            } else {
                recordAudio.className = recordAudio.className.replace('record-audio', 'stop-recording-audio selected');
                if (config.onRecordingStarted) config.onRecordingStarted('audio');
            }
        };
    }

    if (buttons.has('record-video')) {
        var recordVideo = document.createElement('div');
        recordVideo.className = 'control ' + (config.toggle.has('record-video') ? 'stop-recording-video selected' : 'record-video');
        volumeControl.appendChild(recordVideo);

        recordVideo.onclick = function() {
            if (recordVideo.className.indexOf('stop-recording-video') != -1) {
                recordVideo.className = recordVideo.className.replace('stop-recording-video selected', 'record-video');
                if (config.onRecordingStopped) config.onRecordingStopped('video');
            } else {
                recordVideo.className = recordVideo.className.replace('record-video', 'stop-recording-video selected');
                if (config.onRecordingStarted) config.onRecordingStarted('video');
            }
        };
    }

    if (buttons.has('volume-slider')) {
        var volumeSlider = document.createElement('div');
        volumeSlider.className = 'control volume-slider';
        volumeControl.appendChild(volumeSlider);

        var slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 100;
        slider.value = 100;
        slider.onchange = function() {
            mediaElement.volume = '.' + slider.value.toString().substr(0, 1);
        };
        volumeSlider.appendChild(slider);
    }

    if (buttons.has('full-screen')) {
        var zoom = document.createElement('div');
        zoom.className = 'control ' + (config.toggle.has('zoom-in') ? 'zoom-out selected' : 'zoom-in');

        if (!slider && !recordAudio && !recordVideo && zoom) {
            mediaControls.insertBefore(zoom, mediaControls.firstChild);
        } else volumeControl.appendChild(zoom);

        zoom.onclick = function() {
            if (zoom.className.indexOf('zoom-out') != -1) {
                zoom.className = zoom.className.replace('zoom-out selected', 'zoom-in');
                exitFullScreen();
            } else {
                zoom.className = zoom.className.replace('zoom-in', 'zoom-out selected');
                launchFullscreen(mediaElementContainer);
            }
        };

        function launchFullscreen(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        }

        function exitFullScreen() {
            if (document.fullscreen) {
                document.cancelFullScreen();
            }

            if (document.mozFullScreen) {
                document.mozCancelFullScreen();
            }

            if (document.webkitIsFullScreen) {
                document.webkitCancelFullScreen();
            }
        }

        function screenStateChange(e) {
            if (e.srcElement != mediaElementContainer) return;

            var isFullScreeMode = document.webkitIsFullScreen || document.mozFullScreen || document.fullscreen;

            mediaElementContainer.style.width = (isFullScreeMode ? (window.innerWidth - 20) : config.width) + 'px';
            mediaElementContainer.style.display = isFullScreeMode ? 'block' : 'inline-block';

            if (config.height) {
                mediaBox.style.height = (isFullScreeMode ? (window.innerHeight - 20) : config.height) + 'px';
            }

            if (!isFullScreeMode && config.onZoomout) config.onZoomout();
            if (isFullScreeMode && config.onZoomin) config.onZoomin();

            if (!isFullScreeMode && zoom.className.indexOf('zoom-out') != -1) {
                zoom.className = zoom.className.replace('zoom-out selected', 'zoom-in');
                if (config.onZoomout) config.onZoomout();
            }
            setTimeout(adjustControls, 1000);
        }

        document.addEventListener('fullscreenchange', screenStateChange, false);
        document.addEventListener('mozfullscreenchange', screenStateChange, false);
        document.addEventListener('webkitfullscreenchange', screenStateChange, false);
    }

    if (buttons.has('volume-slider') || buttons.has('full-screen') || buttons.has('record-audio') || buttons.has('record-video')) {
        mediaElementContainer.appendChild(volumeControl);
    }

    var mediaBox = document.createElement('div');
    mediaBox.className = 'media-box';
    mediaElementContainer.appendChild(mediaBox);

    if (config.title) {
        var h2 = document.createElement('h2');
        h2.innerHTML = config.title;
        h2.setAttribute('style', 'position: absolute;color:white;font-size:17px;text-shadow: 1px 1px black;padding:0;margin:0;text-align: left; margin-top: 10px; margin-left: 10px; display: block; border: 0;line-height:1.5;z-index:1;');
        mediaBox.appendChild(h2);
    }

    mediaBox.appendChild(mediaElement);

    if (!config.width) config.width = (innerWidth / 2) - 50;

    mediaElementContainer.style.width = config.width + 'px';

    if (config.height) {
        mediaBox.style.height = config.height + 'px';
    }

    mediaBox.querySelector('video').style.maxHeight = innerHeight + 'px';

    var times = 0;

    function adjustControls() {
        mediaControls.style.marginLeft = (mediaElementContainer.clientWidth - mediaControls.clientWidth - 2) + 'px';

        if (slider) {
            slider.style.width = (mediaElementContainer.clientWidth / 3) + 'px';
            volumeControl.style.marginLeft = (mediaElementContainer.clientWidth / 3 - 30) + 'px';

            if (zoom) zoom.style['border-top-right-radius'] = '5px';
        } else {
            volumeControl.style.marginLeft = (mediaElementContainer.clientWidth - volumeControl.clientWidth - 2) + 'px';
        }

        volumeControl.style.marginTop = (mediaElementContainer.clientHeight - volumeControl.clientHeight - 2) + 'px';

        if (times < 10) {
            times++;
            setTimeout(adjustControls, 1000);
        } else times = 0;
    }

    if (config.showOnMouseEnter || typeof config.showOnMouseEnter === 'undefined') {
        mediaElementContainer.onmouseenter = mediaElementContainer.onmousedown = function() {
            adjustControls();
            mediaControls.style.opacity = 1;
            volumeControl.style.opacity = 1;
        };

        mediaElementContainer.onmouseleave = function() {
            mediaControls.style.opacity = 0;
            volumeControl.style.opacity = 0;
        };
    } else {
        setTimeout(function() {
            adjustControls();
            setTimeout(function() {
                mediaControls.style.opacity = 1;
                volumeControl.style.opacity = 1;
            }, 300);
        }, 700);
    }

    adjustControls();

    mediaElementContainer.toggle = function(clasName) {
        if (typeof clasName != 'string') {
            for (var i = 0; i < clasName.length; i++) {
                mediaElementContainer.toggle(clasName[i]);
            }
            return;
        }

        if (clasName == 'mute-audio' && muteAudio) muteAudio.onclick();
        if (clasName == 'mute-video' && muteVideo) muteVideo.onclick();

        if (clasName == 'record-audio' && recordAudio) recordAudio.onclick();
        if (clasName == 'record-video' && recordVideo) recordVideo.onclick();

        if (clasName == 'stop' && stop) stop.onclick();

        return this;
    };

    mediaElementContainer.media = mediaElement;

    return mediaElementContainer;
}

// __________________
// getAudioElement.js

function getAudioElement(mediaElement, config) {
    config = config || {};

    if (!mediaElement.nodeName || (mediaElement.nodeName.toLowerCase() != 'audio' && mediaElement.nodeName.toLowerCase() != 'video')) {
        var mediaStream = mediaElement;
        mediaElement = document.createElement('audio');

        try {
            mediaElement.setAttributeNode(document.createAttribute('autoplay'));
            mediaElement.setAttributeNode(document.createAttribute('controls'));
        } catch (e) {
            mediaElement.setAttribute('autoplay', true);
            mediaElement.setAttribute('controls', true);
        }

        if ('srcObject' in mediaElement) {
            mediaElement.mediaElement = mediaStream;
        } else {
            mediaElement[!!navigator.mozGetUserMedia ? 'mozSrcObject' : 'src'] = !!navigator.mozGetUserMedia ? mediaStream : (window.URL || window.webkitURL).createObjectURL(mediaStream);
        }
    }

    config.toggle = config.toggle || [];
    config.toggle.has = function(element) {
        return config.toggle.indexOf(element) !== -1;
    };

    var mediaElementContainer = document.createElement('div');
    mediaElementContainer.className = 'media-container';

    var mediaControls = document.createElement('div');
    mediaControls.className = 'media-controls';
    mediaElementContainer.appendChild(mediaControls);

    var muteAudio = document.createElement('div');
    muteAudio.className = 'control ' + (config.toggle.has('mute-audio') ? 'unmute-audio selected' : 'mute-audio');
    mediaControls.appendChild(muteAudio);

    muteAudio.style['border-top-left-radius'] = '5px';

    muteAudio.onclick = function() {
        if (muteAudio.className.indexOf('unmute-audio') != -1) {
            muteAudio.className = muteAudio.className.replace('unmute-audio selected', 'mute-audio');
            mediaElement.muted = false;
            if (config.onUnMuted) config.onUnMuted('audio');
        } else {
            muteAudio.className = muteAudio.className.replace('mute-audio', 'unmute-audio selected');
            mediaElement.muted = true;
            if (config.onMuted) config.onMuted('audio');
        }
    };

    if (!config.buttons || (config.buttons && config.buttons.indexOf('record-audio') != -1)) {
        var recordAudio = document.createElement('div');
        recordAudio.className = 'control ' + (config.toggle.has('record-audio') ? 'stop-recording-audio selected' : 'record-audio');
        mediaControls.appendChild(recordAudio);

        recordAudio.onclick = function() {
            if (recordAudio.className.indexOf('stop-recording-audio') != -1) {
                recordAudio.className = recordAudio.className.replace('stop-recording-audio selected', 'record-audio');
                if (config.onRecordingStopped) config.onRecordingStopped('audio');
            } else {
                recordAudio.className = recordAudio.className.replace('record-audio', 'stop-recording-audio selected');
                if (config.onRecordingStarted) config.onRecordingStarted('audio');
            }
        };
    }

    var volumeSlider = document.createElement('div');
    volumeSlider.className = 'control volume-slider';
    volumeSlider.style.width = 'auto';
    mediaControls.appendChild(volumeSlider);

    var slider = document.createElement('input');
    slider.style.marginTop = '11px';
    slider.style.width = ' 200px';

    if (config.buttons && config.buttons.indexOf('record-audio') == -1) {
        slider.style.width = ' 241px';
    }

    slider.type = 'range';
    slider.min = 0;
    slider.max = 100;
    slider.value = 100;
    slider.onchange = function() {
        mediaElement.volume = '.' + slider.value.toString().substr(0, 1);
    };
    volumeSlider.appendChild(slider);

    var stop = document.createElement('div');
    stop.className = 'control stop';
    mediaControls.appendChild(stop);

    stop.onclick = function() {
        mediaElementContainer.style.opacity = 0;
        setTimeout(function() {
            if (mediaElementContainer.parentNode) {
                mediaElementContainer.parentNode.removeChild(mediaElementContainer);
            }
        }, 800);
        if (config.onStopped) config.onStopped();
    };

    stop.style['border-top-right-radius'] = '5px';
    stop.style['border-bottom-right-radius'] = '5px';

    var mediaBox = document.createElement('div');
    mediaBox.className = 'media-box';
    mediaElementContainer.appendChild(mediaBox);

    var h2 = document.createElement('h2');
    h2.innerHTML = config.title || 'Audio Element';
    h2.setAttribute('style', 'position: absolute;color: rgb(160, 160, 160);font-size: 20px;text-shadow: 1px 1px rgb(255, 255, 255);padding:0;margin:0;');
    mediaBox.appendChild(h2);

    mediaBox.appendChild(mediaElement);

    mediaElementContainer.style.width = '329px';
    mediaBox.style.height = '90px';

    h2.style.width = mediaElementContainer.style.width;
    h2.style.height = '50px';
    h2.style.overflow = 'hidden';

    var times = 0;

    function adjustControls() {
        mediaControls.style.marginLeft = (mediaElementContainer.clientWidth - mediaControls.clientWidth - 7) + 'px';
        mediaControls.style.marginTop = (mediaElementContainer.clientHeight - mediaControls.clientHeight - 6) + 'px';
        if (times < 10) {
            times++;
            setTimeout(adjustControls, 1000);
        } else times = 0;
    }

    if (config.showOnMouseEnter || typeof config.showOnMouseEnter === 'undefined') {
        mediaElementContainer.onmouseenter = mediaElementContainer.onmousedown = function() {
            adjustControls();
            mediaControls.style.opacity = 1;
        };

        mediaElementContainer.onmouseleave = function() {
            mediaControls.style.opacity = 0;
        };
    } else {
        setTimeout(function() {
            adjustControls();
            setTimeout(function() {
                mediaControls.style.opacity = 1;
            }, 300);
        }, 700);
    }

    adjustControls();

    mediaElementContainer.toggle = function(clasName) {
        if (typeof clasName != 'string') {
            for (var i = 0; i < clasName.length; i++) {
                mediaElementContainer.toggle(clasName[i]);
            }
            return;
        }

        if (clasName == 'mute-audio' && muteAudio) muteAudio.onclick();
        if (clasName == 'record-audio' && recordAudio) recordAudio.onclick();
        if (clasName == 'stop' && stop) stop.onclick();

        return this;
    };

    mediaElementContainer.media = mediaElement;

    return mediaElementContainer;
}



const rtcConfStyles = `
/*
Muaz Khan     - www.MuazKhan.com
MIT License   - www.WebRTC-Experiment.com/licence
Documentation - github.com/muaz-khan/WebRTC-Experiment/tree/master/getMediaElement
*/

.media-container, .media-container * {
    margin: 0;
    padding: 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
}

.media-container, .media-container * {
    -moz-transition: all .5s ease-in-out;
    -ms-transition: all .5s ease-in-out;
    -o-transition: all .5s ease-in-out;
    -webkit-transition: all .5s ease-in-out;
    transition: all .5s ease-in-out;
}

.media-container {
    width: 36%;
    display: inline-block;
    border: 1px solid rgb(0, 0, 0);
    border-radius: 4px;
    overflow: hidden;
    vertical-align: top;
    background: white;
}

.media-box {
    background: black;
    border: 1px solid rgb(107, 107, 107);
    margin: 1px;
}

.media-controls, .volume-control {
    margin-top: 2px;
    position: absolute;
    margin-left: 5px;
    z-index: 100;
    opacity: 0;
}

.media-controls .control, .volume-control .control {
    width: 35px;
    height: 35px;
    background-position: center center;
    background-repeat: no-repeat;
    float: left;
    background-color: rgba(255, 255, 255, 0.84);
}

.media-controls .control:first-child {
    border-bottom-left-radius: 5px;
}

.volume-control .control:first-child {
    border-top-left-radius: 5px;
}

.media-controls .control:hover, .media-controls .selected, .volume-control .control:hover {
    background-color: rgba(255, 255, 255, 0.74);
}

.media-controls .control:active, .media-container .selected, .volume-control .control:active {
    background-color: rgba(255, 255, 255, 0.44)!important;
}

.mute-audio {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAACsUlEQVRYR92Xu2siURTGp0hnJRgVGVNtEcHOiI2taWIa3Vgpgu4qiKBoCpOgxgdofD8QTFYUXMRSRLstt9xyy/0Tttxyi9kz17mXq7majFED+8EH+p2Zub+5j4NygiC8q/8PDQaDn9LHw6rf739Sq9UCthQfRk9PT2Rg7Ha7/U0q71erA2OXy+X9AgQ/B3KsgbFZADc3N25clyL5SiaTKnqgdW40Gs8A4vE4ARD9+Pj4XSq9Ts1m8xf9gE0uFosIYDwezyaTCXnjVqvVpq+T4oWur6/5UChEiuFweOkinL/GeAnoDD0ENJ1Of7ByTqFQ8HQB+/7+vi3WWbV1fnh4eAYgWsxEQb8gWSQS+YjCk5MTJkA2m5UNUK1WyR4olUq/cW6z2cJidn5+foSz09PTBYBer2cCpNNp2QC1Wm1pE9I1WIIz8BGAoe+xWEwYjUY8p9PpmAB3d3dbLwEWvOUHXHO73WdiZjAYrDiDE8JzWq2WCZBKpWQDwNstAXg8HgJgtVoRgN1uJwAul2v9DGwDsDoD0D8IALw5AnA6nQTg8vKS5zQazc72QKVSWQIIBAIEwGw2IwCHw0EALi4ueE6lUjEB8vn8m2fAYrEQgKurKwRgMpkIgN/v58UBmAC5XE42wOopgGeQGswOAlAqlQggGAwKnU6H546Pj5kA8DZvApjP56QPGI1G1Aeg65I+AHtv0QfWnQLo67IBYNkQQK/Xm9H5bDZDANBzCACs/wIApoIJgIogVm2dWa0Yms1X9CAQnUvRy6JvesmFQoEsgfhd+ohEXxeNRstS/DrRN29yt9td2oRY9DVer1fe7wEsn89npx/Ecr1e3wiQSCT+StH2ogdcdSaTYQLsXMPh8A8LgPWTbG+CM29cBZBKh9Xt7e0XOPfvM/hOxPrHekgzw8NZ4P4BtGizy4jmqy8AAAAASUVORK5CYII=');
}

.unmute-audio {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAACY0lEQVRYR9WXS2/aQBDHfa9POaDGhKTpgTNIfICohfI4wC0HDuWdOCWQBKy24hmUBqduAjgVhx4Q50oIPk0/TQ/urhlbNplFEcWu+pd+EjszO7OyZweZ0zTtn4Ia3QQ1uslWNJ1OVVmWtU6n8xpM7ikSiVQ8Ho9mAGbnlcvlDq2FXT1AvV7/jRWnQIgzGg2GC6yoFQjdvsJv3ipYwVUgfHuKRt4dYYVYwLbnKxaL7WCJsu8zvHzbF8ST0ye+dUDa56vdbqOJvLsCrw5HwtXFJepnAWl1kdkgEU5gaUpRlGPCjb4gwwNNdHjwir9XvgnV8wrqZ6EnJQoGgynDlkgkjsDMpVKpgGEPBAIZTpIkWwID+gS+yndC+ewD6mcBdWhe8wCUeDzuTSaTL6y2QqGQ4brdrmmw4vPu8cOHgXBRqaJ+FlBfV7lclrAYSj6fX76CRqOBBhz49vnv6qNQu7xC/Sz0pBaRofVjNUYUxZ/g5rher2dzGuzv+XgyeDbuAavWxjSbTZvTgB6ANmGlfI76WUBaU1gMBdwc12q10ADh5S5/15eFs1MR9bOAtLpI99t6oFarmb+j0eiyB1gHoE04uH/YuAnT6bTtFhSLRS9pStstIFcywxxE9Ak8jtSNB1E4HDYPUCqVzDlQrVbNORAKhTLMJ0B74G9vwWKxkAhPJuF8Pj8mLF9BNpvdIdiSfP74SbvudPnbmy/O/xes02w2E/r9PlqIBWzdrsjgKGHFMGCLM8IKrgKhzmkymfzCChtAmPNi3R5wuyNyp6PW4n6/3/0PE6rxeKwSYrD8z4R9MLqHxv0BTZnWtpv+sYEAAAAASUVORK5CYII=');
}

.mute-video {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAABoElEQVRYR2NgGAWDNARSge4qJxL7UN0PfHx8O5iZmW8CDSYGd1HdAXJycns4ODjuAQ3Ghz8D5f8D8SKqO0BfXz+Ll5e3FmgwPnyelg7gADqAE2gBPryEZg4gMkgXUtsBTEAD2UjAi6EOAIUEsj5GZA8A0xOTpKQkNnOZ0T0qCRRIJAEfhTrgGJoeQTQHSAMdgM1cY3QH2AAFXpOAf0AdAKKR9WmCDO7q6hIPCgrSEhISShQREcFmbg26AxyhBoKyFiVYF2RwW1tbrr+//zEWFpZrQIzNvDaaOsDGxqZdWVn5GyMj408cHqKNA9jY2EqApWg4Dw/PZk5OTnwhSTMHnGZiYjoA9PVjAlFJGweA4hsY7MSkIdo4gIQEPOqAYRoCwBxATAIEqaFNCADLgcdAR9wFWvBhQLIhOzt7K7AgygE6Yi+B0KBNCAAttQA6gNfAwGASsCqmf0kIDHZwZZSTk1Po4OBwBlgw3SK2MiK1OsZVdcOqYwNgdRzOzc3dyM/PT1R1rAJ0eB8VMKhhAwfAaNAANkiwmeuNXh2P8kdmCAAAkSPyEJegDaEAAAAASUVORK5CYII=');
}

.unmute-video {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAACFUlEQVRYR2NgGIFgPtDPGQPlb5Dl/4H4PRBL4HNEKlCynEjsQ6RvYJZ/B6p3wKuHj49vBzMz802gImJwFxEOaID6HGS5B0H1cnJyezg4OO4BFeLDn6GGLiJgIGmWgwzT19fP4uXlrQUy8eHzRDigAKoGFO8RBH0OUwB0AAfQAZxAPj68hIADEpAsB7GpDhbicQCy5RXE2swEVMhGAl4MdQAoJJD1JSL5vAGYnpgkJSWxmcuM7jBJoABIM7H4KNSiY0h6+oDsH1DxBpAFQAdIAx2AzUxjdAfYAAVek4BhFoFokL6PQPwPZnlXV5d4UFCQlpCQUKKIiAg2c2vQHeCIFHSgVEsungMyuK2tLdff3/8YCwvLNSDGZlYbrRygCzLYxsamXVlZ+RsjI+NPHJ6hjQPY2NhKgKVoOA8Pz2ZOTk58oUgzB5xmYmI6APT1YwLRSBsHgOIbGOzEpB/aOICExDvqgGEaAsAcQEwCBKmhTQgAy4HHQEfcBVrwYUCyITs7eyuwIMoBOmIvgdCgTQgALbUAOoDXwMBgErAmpH9JCAx2cF2Qk5NT6ODgcAZYMN0itjKCVceglivI5aCqFdR+J6WKBqnVBDkAWB0bAKvjcG5u7kZ+fn6iqmMVoL4rUMt/A2lQiwfUwCAVgxo2cACMBg1ggwSbGd7o1fF0qOXEtd3RdVPIbxixloMCDpZViO84UBjcyNoBhLMZ3JbarLEAAAAASUVORK5CYII=');
}

.record-audio {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAACuUlEQVRYR72WTW8SURiFm9jquiGFhXahdWWl9bMWozQhIUaBahA/0spGKli1VC0EaqpSUIpWksoELcwaQrBCWLl073/xN4z3JXfIncuBIUZ8krOYM/e9z2SGCTOiaRqMGc1m81CtVsuUSqWMqqpTvO4L9KCS0o9qtXpgtVo1Ofx0T6AHlZReZDKZXSTX4/f7J/nSLqAHlRREOByeRlI5fHkX0INKCsLn891EQjnFYvEaHzEAPaikmCFL8/m86RD0oJKCmJubs8tiOewuKfF4fIaPGIAeVFIQTDDQIwiFQrf4iAHoQSWlH+y9V2RpIpHoP8SAHlRSEOwtOBOJRFRZricQCKjJZFItl8tn+YgB6EElBWGz2QZ6BMFgcDiPYNY+cwkJ5axGHs/zEQPQg0qKGbK0sPfZdAh6UElBeK7f8MlilHRqe5GPGIAeVFIQk0ePDfQbeLC0PJzfwMkTUwNdwNPVJ//mAjwez7K+Kfv//22fPj3QBWwmkovicaVSWfqrC0ilUpfFje7fvXdOPO6V798OFsTj9mYM6EElRUfcqNVqbd25Hej7PXDx/IVT0WdrTf34xfrzfb4V9qCSopNOp/dEQfbd+7H4Ruyn2Omh9QtXnWNypwM9qKSIiBsyeZ3d4olXyc3R2MsN9VFoRf2wk1O/Fr+MrjwMTYhr19eiab5FG+hBJUVEUZR5ceM3W69/8VMGxDXbb1PGTRjQg0qKjNPpHBcFlJ1sVivvlzR2Jww95dPH3XE+2gF6UElBsNfS9IPE6/UqhUJhOB8kRC6XO+5yua6wV7RL7na7Z/kyCPSgkmKGw+E4LMotFssRfqon0INKigz76Iyxr55OotFoQrwAFD7aAXpQSZFBArM0Go06H28DPaikyCCBWer1+g8+3gZ6UEmRQQKz8NEO0INKyjCAHlT+v2gjfwDNQh1izdJWJQAAAABJRU5ErkJggg==');
}

.record-video {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwAAADsABataJCQAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAACEElEQVRYR+2XvUscQRiHT89vSJEgWgSDBARTJIUELBQ8LZNaLCyCmCqICKZJ5T8QBSsr4UBE7QQFIW3wE2KKgEjiB1goCFEEEfxIzucnMzIst3vnMbjNLTzs7Ozs+/7mnXc+NpHJZBJxEqtzdfxeQOIRLzfiRQHFCLgRmCAPn2fJxVfUrfkkLAkvcbIEzQERb3lmvvgjTIB18hNnHVBmhDy6AAk5gn54CrEIkIgLGIVPPsMvW7mGIDjeh3EL8JqAhUSgKCCfCPwntCeQhm5ohw8wD+eg9/d2HpqEuQT8w/gmvAwsYPbxPYXfrgjfAjYw/ibEua2uMtP6rjMPFRA1DU8xWAslOQTodSVIbN4CtBCNQdRCtML7UiNgins23L1lOF8BWoo/Qq6leNrp+R830Zxyn9NmIR8B2oxSUG4+jNoL0rSpMRFo4L4bEDHLs8ZfVxLWowQUsh1/w2CT08NWysr4K5gDDY+9XlPYjhKgA8kz5wNb1IFEyl1+8KwEVIK+MxGw7bWVfwUbQdv7zxTO4NjHqfgJhsbhBmagMYtwW6XQKzLf4RqGfAjQtJNR5YvCPQkvQkS0UL9onGvI6nwIkK9q6IV9I0LHuUFoAw1bJ3yBZeNc58oUJH0JkAjNgB44AK33f2EHtmAPNOZaqlehCyr0kU8Bsqezo6bgCASn4S/qBqBePVfjUAFx/SHH/nd8C3srt2KeTS1mAAAAAElFTkSuQmCC');
}

.stop-recording-audio {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAADAUlEQVRYR7WWS08TURiGhxTULSGUhZKouBILXhGMFkNCjJaiwXoJlI1FKiqlSpteglpahSqSYJsq7awhTUUaVizd+xtcuDQmxkTdeRnP15xpzhzedhoiT/IkzDvnO+9kphNG0TQNakaxWLTk8/lENptNqKraxuOqwB4UktVYXV1ds1qtmiw/XRHYg0KyEolEYgGV6w4NDbXypVuAPSgkEePj4+2oVJYv3wLsQSGJcDqdl1GhbCaTucBHDMAeFJJmyKWLi4umQ7AHhSSiq6vLJhfLsruUDgaDHXzEAOxBIYlgBTU9Ao/Hc4WPGIA9KCSrwd77tFwaCoWqDzFgDwpJBHsLjnq9XlUu13W5XGo4HFZzudwxPmIA9qCQRLS0tNT0CEZHR3fmEXTaOk6jQtkJ751uPmIA9qCQNEMuTS29Mh2CPSgkEY6Ll5xyMTIemx3kIwZgDwpJROvefTX9BtzDIzvzGzh0sK2mC7g3cff/XIDD4RjRN2X//7/a2o/UdAGRUHhQPF5ZWRne1gXEYrEz4kY3r984Lh5X8t3btV7xuLQZA/agkNQRN9rY2Ji5dtVV9Xvg1ImTh333J4v68YMp/zLfCvegkNSJx+NLYsHc02cNwenAezHTpfW95+wNcqYDe1BIiogbsvICu8XN0XCkPvBwWr3tGVOfzyfVN5nX9WO3PM3i2qlJX5xvUQL2oJAUSafT3eLGj2cefeCnDIhrZp/EjJswYA8KSRm73d4oFpDzc3NabjmrsTthyMmXLxYa+WgZ2INCEsFeS9MPkoGBgXQqldqZDxIimUwe6OvrO8teUUNxNBrV+vv7O/kyCOxBIWlGT0/PLvECmpqadvNTFYE9KCRl2EdngH31lPX5fCHxAtxudygSiQT8fn/pPHt9A3y0DOxBISkjltXq+vp6gY+XgD0oJGVQgZmFQmGTj5eAPSgkZb7X1f0oLTfxo8XySZePloE9KCRF2NH+P4rymfnrt6L8/Kso39jfX/TSSvLxMrAHhdtWUfYwz5dFawxqyj+MRz2Y+XGHbwAAAABJRU5ErkJggg==');
}

.stop-recording-video {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwAAADsABataJCQAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAACAElEQVRYR+2XvUscQRiHT42aBCwU0SIoQRBioUUQLBROLWMtKSxEtBKRQGys/AsUrKwC14itoCDYip+gFoJIiAoWCoKKIIJfOZ+fzBzDcbv3weA2d/DA7M7uO8+887FzsWQyGYuSSBtXx1MCsXf8uRkvChQz4GZgjnn4JcNcbOHelk+CJuEDjazAtzSJdq5ZL/4IErCN7NNYHD4YkXcXkMgFDEM1RCIgiXuYhlGf6VesbEOQPt7nUQt4nYCFZKAokEsG/pPaa0hAP3TBICzCHag+FSffSZhN4IXge9CUtoHZyz4Kf10J3wI7BG8LaNze/miW9Vtn8hUIW4Y3BKyFkiwCqq4EyeYsoI1oBsI2og3qSyXwdrjKAHXut+V3rgLaikcg21Y8b3seIjDkZGcpFwF9jLqh3LwY9i1I8MxnMwQNARnQ+OtXBtthAoV8jlcJ2Oz0sMOVMMNjq1spHIUJ6EBS4wSzRR1IZO6yy7UmoCboD5MB+3xcEk4Gbe8nKNzCpY9TcRWBZuEZFuBrBnF7S6nvgDV4gl8+BLTsFFTz5RH+QGOAxHfuL5vGNWR1PgTU1icYgFMjoePcOHSChq0HJmHdNK5zZTeU+RKQhFbATzgD7fdX8A8O4QQ05tqqN6EXKvSSTwHF09mxAabgWPEdDiiPQb16rocDBaL6hxz5v+NXmoPQBeoNXQgAAAAASUVORK5CYII=');
}

.stop {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAAEzUlEQVRYR8VXWUhtZRS+Hud5xAk9TsccUBHRFNFMQUUCLRUjwUBxDpQjCE744AReE3FMSQ3SNBNyfOmpxx6CiKCX6EKjdIsLNyoiClbr+9n78J999j57Sxfa8HHYe69/rW+v/1vrX+cBET34PyGCW7x82M6X4c8IZARpgGcBDD8GbE0vEdsCAQQNYxQxRhkfMh4x/mSAPfA34zHjY8Y8o4YRqZA1JGKFAAK/wNiy2Wx3YWFhlJycTFlZWZSbm0t5eXkuZGdnU2pqKkVHR5O/v/8Thegr/BujZM6DiDcCNraOZ7zh4+PzNZyWl5fT+Pg4r/GumZWVFWpqaqKkpCQQuWMfa0r2sHVulxEBBM9kPAwMDPyloKCAZmZmTANrie3u7lJtbS2Fh4dji64YFdot0SMA8djBOiQk5Pf6+nq6uLi4d3CZTE9PD8XExKgknpdJ6BGAcGaCg4N/RRrN0m31/fDwsNAG+z5nZDFElWgJoITa/fz8vsd+W3Vu1a6zs5M4q39xjFlGiB6BWH74EcSD/dNzPDk5Sefn56bk1tbWdG1KSkqIq+k7jvMiwyZnAMLrZNH91tbWpru4q6uLoqKiKD8/n05PT3Vtbm9vqbKyUlTA2NiYh83CwoLwwbH2oAWZAErkg4SEBDo5OfFYCGeKmkXjycnJocvLSze76+trKi4uJl9fX2ETFxdHi4uLHr6KioqIS/tntkmRCdg5NU+N9v7s7Ew0HDhWgcajbtPNzY1oTOzY9T4zM5MODg48CAwMDBBnGnavygRa8XBwcNBwf4+OjsjhcLiRQBCkNS0tzS14RkYG7ezs6PqCn4iICPh5SyawiDa7tbXlVWCHh4eUkpLiRiI0NNTtPj09nfb39736iY2NxZpPZALHkZGRlpoO0pqYmOgWVN0WnAV6addWVHx8PNZ/KxN4H+qEkKzUdW9vr7qPLiJYv7S0ZGm9QuAHmcB7yIBW2Xpk9vb2xKknCw4ZgPqrq6vvQ+AbmcBDlBmce8vA9va2OI7lauDu5rrnLko1NTWmJFCi7ONTmcBrQUFBNDIyYrgY3Q1fLgdHPxgaGiJFVOIdH8HU2Nho6AcljWyzLWrUNRE5uA8YpnBjY0OUmhy8sLDQFWR+fp7QxNT3KOnm5mZdEqOjo4SPZdvXZQKY7x6hhV5dXek2D7XcQLSsrMzDRksCQtM7E7CWffzE8RwyAcx9TjBDz9fTQUtLC6FXeBPa7OysyATO/76+Pg8/6+vr6na9qz0LcDpmML5Eqo+Pj3VJTExMmApseXmZjOyqqqqIhfojx2nQnoYggLG6KyAg4HFdXZ1pICv9Qrbp7+9XDzTMiBh2PQYSPItmvIn97ujoeGYkpqamSGk+n7H/Uny9EQG8eI7xDvpCa2vrfybhdDpF6+bG9QX7fZkBwYtLFqH6DL8QZB7jkGfDfyoqKggN6L4pR1uHcJUB5HP2h/8IwXIgIwIqCYhyjkVzh0bT0NBAm5ubpkTQaDD/2e12nBd/sA8MotXyl5tlQH2PyTWU8RLjmok8RRmi+7W3t9P09DStrq4KzM3NUXd3N5WWlorpl4WMRvMVY5iRyMD/RY/LWwZkY+gCFVLHeJvxBM0Ihw96vwo8Uw4oDJ1OJTC20/ByEbjv/j5L+38BGxuYOLu/9/8AAAAASUVORK5CYII=');
}

.take-snapshot {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAA8dJREFUWEftVktIW0EU1aq0BUGrYuL/WxF/UasmSm0SBbVqVCrGX0T8VFBpLSrBLxIjKkb8oAtR9xWhIAgtLXRfWorgqqtC/XTTLnTTRW2dnnnOG98zkdTfosULh7w3c+ee827u3BmXa/svbXp62rWrq+tmSkrKncbGxqTm5uZ7paWl3jExMa7M5fJtYWHBY3R09K7BYNCB6JFOp7PExsZu+vv7EwqFQjETGBioYO4Xs9XVVW98oSIxMVHZ3d1dAQJzWFjYEEjfpqam7iclJZGWlhbS09ND9Hq9IIDhPgtxdltfX88YGxurioqKmgsPD18D4UulUvkqOTn5q4SAJCQkkKmpKQJzoaivr+dzJSUlQxaLxYuFdG4TExO38aWtWVlZ70G4FRER8Q2kP2kwKYlIwEj4+OzsLIFYPhcSErKH91gW/tjm5+fd5ubmnthstscoliCkcZkuAJkA/H88CEVvby8nWVxclM2VlZUJc0tLSyQvL4+OHQK/GQ6AOEZ7bDU1NW7FxcV9mPwcHBxsQvHsNDU1cZKKigoZiThOIR2nwPrD6Ojo73jegPANfIAtLS3NaDabjZOTk36MUm61tbVuqF4qgAbYlRJQpKeny0hGRkbI+Pg4qaqqEt5BcoCC/IjnZZAtDgwMNMfFxXli+3larVYPRnO6SQVQYP+C94icVrM4LkVkZOQaauM5is4SFBTU2tfXl8HCnd3q6urcUDxcAAVNOxVAf3NzcwlqYwZF9BCFmI/9rNdoNMGoaOXKysotFub8JgpQqVT8ywMCAghSSNra2gh9Rpp/QNg+w94FoWTUR1ZdXS0UoVQAnHg2sPdJaGgof6cQ/U765ufn87nh4WG69WTrGAIZ9ZHRDKAGnjlwFGAymYTOhhbLx0QSCqkvtrBsrry8nM9JIBdQWVnpWlhYmIzKfYEtSCCGO2dnZxP832TEaiUdTzto8QnjDQ0NBE2KdHZ2cl8RarVamGtvbycatcZuHpALoIY0+6JLfUCRkczMTO6sQl+Pj48XRDyAmFNSelbYCzAajT4FBQXvHDhfBewFoNJR6MpfopNWq5X9lxeBTqtzLqCoqMgXR+eG6GQoNmCt44BnBWI7F4DBgBNOV4l/SEBOTg6y6Di1zoAbkl08hr8XIAbb+rJFtoGdrW2n2N3e4escxQSua8BeAA4jP2xDfo2+KqBNb6LH2N+McIdz7+/v16L3v3a08DxA297EDeuT+I7b0htc9XS4MbkzWrkNDg7eQEv2grPyMoBzxQe3aV/xHUe1F07VG4zu2mAuLn8AJ5n+SnkR0KgAAAAASUVORK5CYII=');
}

.zoom-in {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAe1JREFUWEftl8tqwkAUhn2DPoV3vEaNikENaHAruhLUbUC87FwIbly5cKGbgNBdu3GbF+kTTf2HOSVTx7SL0Aj1wE+mkzP/+RzN5DQSZjDGxCikkACi0SjLZrO+isfjvsj7/f4ln8+zTCajXE9CLeRLAJqmsWKxyIUxyft3qVTyBdjtdma5XGaFQkHygMgbSiQS/gAQimEOVxLMRboyDoeDqeu6tI7G5I8dGgwGagBKzOVyH4vFYrNarSRdt3gj0u/Ger3eLJdLaR28KpUK9x4OhyydTqsBCMJxnDcxHVgYhuH2+32+C6lU6u8BRqORC+/QAEzT5ACoEQpAq9VyqcZjAuC7wWOGx+hyuThiOrCYz+fv8IdisdgtQBjxBHgCPAEeCwAHBL2vT6dT4Cdhr9fjJyFO2uvrnleWAOgmII7HY+AAjUbDhTeUTCbVAATxP19GuIHtAcD5fA4coNls/twPAAA/xmtzGThAu93+3Q5AaKun0ymbzWZsMpnwMVSr1V5F+t0Yj8df+SR4UPG7ALT9SEAHa1kWfyS9PT7ui3Rl0P8F8KI1JJrDVQmAhSiGK4p7F5EAJtKVsd1uTW8+BA+vD8bKthxFq9Uq63a7/JOiGAlQUKfT8QVA1Ot13lXRmu+Ct23btwBhxAMAsMgnlwgSabRVBN4AAAAASUVORK5CYII=');
}

.zoom-out {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAglJREFUWEftV8lqAkEQzYd4EuK47ytueHA5OPgFjoIHEVzwYOIl4NWf8JKDl/xXPqPSr+nSUceZEYfEgA8Kpal686yqqWpf/gWCwSAlEgmKxWK02+3e1LEl4BsOh6W/OrofmqZRKpUiXdepXq9/qGNLpNNpgmWzWRoMBpo6vg+RSIS63a4krVQqtgKSySRlMhlvBdRqNcrn85K0XC7/vgCQ5nI5mVqnEsAX5YKAfr/vjQA0Hwjxy9wI4B7wTABn4BYB8C+VSu4FiDrrSB0eIuosDWR4nXAGUjcCuFnhz0IQZzbRyJev6Hg8lrUrFAqEpuNaMhEHu3kNO52O9OVYsyAYZoVyPwIC0OmNRkMGczbMRG4EcAO2Wq1DDMezRaPRSwGr1cq32WxoOp3SbDaztPl87jjdDMP4WiwWtFwuEfN9zgETz/pU7k888cQDYb1e+8SEMuwsFAoZyv0qxCS1jDVbr9e75JlMJofJd82wF5zuAzz97AwXHOV+BEaxlTOPT/5erVZtBZzHmj/ZLEex2ANyG55bPB4/IXCzjhGHfcCrGXFmzmKx6DjST4DUM5FbAfAX5fLmQoKa3ZIB+CEDYjE9BXgjQLy7khR1bbfbtgLQL7jYwH84HHojIBAIHDq72Ww6ZgB+EDAajbwR4Pf7pQCQbrfbd3VsCfwv5Gzt9/tXdfzAIKI/NHr5AU4kDfWD0WSsAAAAAElFTkSuQmCC');
}

.media-box video {
    width: 100%;
    vertical-align: top;
    object-fit: fill;
}

.media-box audio {
    height: 5em;
}

.volume-control .volume-slider, .media-controls .volume-slider {
    width: auto;
    background: rgba(255, 255, 255, 0.09)!important;
    border: 1px solid white;
    height: 33px;
}

.volume-control .volume-slider input[type=range] , .media-controls .volume-slider  input[type=range] {
    margin-top: 9px;
    height: 15px;
    outline: none;
}

input[type=range] {
    -webkit-appearance: none;
    -moz-appearance: none;
    -o-appearance: none;
    appearance: none;
    background-color: rgb(83, 77, 77);
    width: 200px;
    height: 20px;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    -moz-appearance: none;
    -o-appearance: none;
    appearance: none;
    background-color: black;
    opacity: 0.5;
    width: 10px;
    height: 26px;
}

#conf-container{
  border-style: solid;
  border-color: blue;
  border-width: 6px;
  border-radius: 12px;
  padding: 25px;
}

`;

const rtcInjectedStyles = document.createElement('style');

rtcInjectedStyles.innerHTML = rtcConfStyles;




/*
INJECT A-Frame Component into Scene
*/

const rtcConfEntity = document.createElement('a-entity');
rtcConfEntity.setAttribute('htmlembed','');
rtcConfEntity.style.height = '820px';
rtcConfEntity.style.width = '720px';
rtcConfEntity.setAttribute('class','screen');
rtcConfEntity.object3D.position.set(-2,2,-4);
rtcConfEntity.innerHTML = `
<div id="conf-container">
<image src="https://cdn.glitch.com/d4e948a1-30be-48f1-9fa6-b31246b9754b%2FW_Icon.jpg?v=1578476387376">
<h1>
W City Communications
</h1>
<div class="make-center">
<div>
  <label><input type="checkbox" id="record-entire-conference"> Click Here To Record</label>
  <span id="recording-status" style="display: none;"></span>
  <button id="btn-stop-recording" style="display: none;">Stop Recording</button>
  <br><br>

  <input type="text" id="room-id" value="W Chat" autocorrect="off" autocapitalize="off" size="20">
  <button id="open-room">Open Room</button>
  <button id="join-room">Join Room</button>
  <button id="open-or-join-room">Auto Open Or Join Room</button>
</div>

<div id="videos-container" style="margin: 20px 0;"></div>

<div id="room-urls" style="text-align: center;display: none;background: #F1EDED;margin: 15px -10px;border: 1px solid rgb(189, 189, 189);border-left: 0;border-right: 0;"></div>
</div>

</div>

`





window.addEventListener('DOMContentLoaded', e=>{

document.body.appendChild(rtcInjectedStyles);  

  
const scn = document.querySelector('a-scene');
scn.addEventListener('loaded',e=>{
  
  
  
  scn.appendChild(rtcConfEntity);
  
  
  // ......................................................
// .......................UI Code........................
// ......................................................
document.getElementById('open-room').onclick = function() {
    console.log('open room clicked');
    disableInputButtons();
    connection.open(document.getElementById('room-id').value, function(isRoomOpened, roomid, error) {
        if(isRoomOpened === true) {
          showRoomURL(connection.sessionid);
        }
        else {
          disableInputButtons(true);
          if(error === 'Room not available') {
            alert('Someone already created this room. Please either join or create a separate room.');
            return;
          }
          alert(error);
        }
    });
};

document.getElementById('join-room').onclick = function() {
    console.log('join room clicked');
    disableInputButtons();
    connection.join(document.getElementById('room-id').value, function(isJoinedRoom, roomid, error) {
      if (error) {
            disableInputButtons(true);
            if(error === 'Room not available') {
              alert('This room does not exist. Please either create it or wait for moderator to enter in the room.');
              return;
            }
            alert(error);
        }
    });
};

document.getElementById('open-or-join-room').onclick = function() {
    disableInputButtons();
    connection.openOrJoin(document.getElementById('room-id').value, function(isRoomExist, roomid, error) {
        if(error) {
          disableInputButtons(true);
          alert(error);
        }
        else if (connection.isInitiator === true) {
            // if room doesn't exist, it means that current user will create the room
            showRoomURL(roomid);
        }
    });
};

// ......................................................
// ..................RTCMultiConnection Code.............
// ......................................................

var connection = new RTCMultiConnection();
// Currently using Muaz Khan's rendevous server.
// https://rtcmulticonnection.herokuapp.com:443/
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

connection.socketMessageEvent = 'video-conference-demo-abcdef';

connection.session = {
    audio: true,
    video: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};

connection.videosContainer = document.querySelector('a-assets');
connection.onstream = function(event) {
    var existing = document.getElementById(event.streamid);
    if(existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    event.mediaElement.removeAttribute('src');
    event.mediaElement.removeAttribute('srcObject');
    event.mediaElement.muted = true;
    event.mediaElement.volume = 0;

    var video = document.createElement('video');

    try {
        video.setAttributeNode(document.createAttribute('autoplay'));
        video.setAttributeNode(document.createAttribute('playsinline'));
    } catch (e) {
        video.setAttribute('autoplay', true);
        video.setAttribute('playsinline', true);
    }

    if(event.type === 'local') {
      video.volume = 0;
      try {
          video.setAttributeNode(document.createAttribute('muted'));
      } catch (e) {
          video.setAttribute('muted', true);
      }
    }
    video.srcObject = event.stream;

    var width = parseInt(connection.videosContainer.clientWidth / 3) - 20;
    var mediaElement = getHTMLMediaElement(video, {
        title: event.userid,
        buttons: ['full-screen'],
        width: width,
        showOnMouseEnter: false
    });
  

    connection.videosContainer.appendChild(mediaElement);
  
    mediaElement.id = event.streamid;
  
    if(!CS1.videoConfParticipants)CS1.videoConfParticipants=[];
    
    video.setAttribute('playsinline','');
    video.setAttribute('crossorigin','anonymous');
    video.id = `participant-${CS1.videoConfParticipants.length+1}`;
    
    setTimeout( _=>{
        mediaElement.media.play();
      
      
        
        const p  = document.createElement('a-plane');
        p.setAttribute('position',`${2*CS1.videoConfParticipants.length} 2 -4`);
        p.setAttribute('src',`#participant-${CS1.videoConfParticipants.length+1}`);
        CS1.videoConfParticipants.push(p);
        CS1.scene.appendChild(p);

    }, 5000);

    

    // to keep room-id in cache
    localStorage.setItem(connection.socketMessageEvent, connection.sessionid);

    chkRecordConference.parentNode.style.display = 'none';

    if(chkRecordConference.checked === true) {
      btnStopRecording.style.display = 'inline-block';
      recordingStatus.style.display = 'inline-block';

      var recorder = connection.recorder;
      if(!recorder) {
        recorder = RecordRTC([event.stream], {
          type: 'video'
        });
        recorder.startRecording();
        connection.recorder = recorder;
      }
      else {
        recorder.getInternalRecorder().addStreams([event.stream]);
      }

      if(!connection.recorder.streams) {
        connection.recorder.streams = [];
      }

      connection.recorder.streams.push(event.stream);
      recordingStatus.innerHTML = 'Recording ' + connection.recorder.streams.length + ' streams';
    }

    if(event.type === 'local') {
      connection.socket.on('disconnect', function() {
        if(!connection.getAllParticipants().length) {
          location.reload();
        }
      });
    }
};

var recordingStatus = document.getElementById('recording-status');
var chkRecordConference = document.getElementById('record-entire-conference');
var btnStopRecording = document.getElementById('btn-stop-recording');
btnStopRecording.onclick = function() {
  var recorder = connection.recorder;
  if(!recorder) return alert('No recorder found.');
  recorder.stopRecording(function() {
    var blob = recorder.getBlob();
    invokeSaveAsDialog(blob);

    connection.recorder = null;
    btnStopRecording.style.display = 'none';
    recordingStatus.style.display = 'none';
    chkRecordConference.parentNode.style.display = 'inline-block';
  });
};

connection.onstreamended = function(event) {
    var mediaElement = document.getElementById(event.streamid);
    if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
    }
};

connection.onMediaError = function(e) {
    if (e.message === 'Concurrent mic process limit.') {
        if (DetectRTC.audioInputDevices.length <= 1) {
            alert('Please select external microphone. Check github issue number 483.');
            return;
        }

        var secondaryMic = DetectRTC.audioInputDevices[1].deviceId;
        connection.mediaConstraints.audio = {
            deviceId: secondaryMic
        };

        connection.join(connection.sessionid);
    }
};

// ..................................
// ALL below scripts are redundant!!!
// ..................................

function disableInputButtons(enable) {
    document.getElementById('room-id').onkeyup();

    document.getElementById('open-or-join-room').disabled = !enable;
    document.getElementById('open-room').disabled = !enable;
    document.getElementById('join-room').disabled = !enable;
    document.getElementById('room-id').disabled = !enable;
}

// ......................................................
// ......................Handling Room-ID................
// ......................................................

function showRoomURL(roomid) {
    var roomHashURL = '#' + roomid;
    var roomQueryStringURL = '?roomid=' + roomid;

    var html = '<h2>Other People can join Your Chat</h2><br>';

    html += 'Hash URL: <a href="' + roomHashURL + '" target="_blank">' + roomHashURL + '</a>';
    html += '<br>';
    html += 'QueryString URL: <a href="' + roomQueryStringURL + '" target="_blank">' + roomQueryStringURL + '</a>';

    var roomURLsDiv = document.getElementById('room-urls');
    roomURLsDiv.innerHTML = html;

    roomURLsDiv.style.display = 'block';
}

(function() {
    var params = {},
        r = /([^&=]+)=?([^&]*)/g;

    function d(s) {
        return decodeURIComponent(s.replace(/\+/g, ' '));
    }
    var match, search = window.location.search;
    while (match = r.exec(search.substring(1)))
        params[d(match[1])] = d(match[2]);
    window.params = params;
})();

var roomid = '';
if (localStorage.getItem(connection.socketMessageEvent)) {
    //roomid = localStorage.getItem(connection.socketMessageEvent);
    roomid = document.getElementById('room-id').value;
} else {
    //roomid = connection.token();
    roomid = document.getElementById('room-id').value;
}

var txtRoomId = document.getElementById('room-id');
txtRoomId.value = roomid;
txtRoomId.onkeyup = txtRoomId.oninput = txtRoomId.onpaste = function() {
    localStorage.setItem(connection.socketMessageEvent, document.getElementById('room-id').value);
};

var hashString = location.hash.replace('#', '');
if (hashString.length && hashString.indexOf('comment-') == 0) {
    hashString = '';
}

var roomid = params.roomid;
if (!roomid && hashString.length) {
    roomid = hashString;
}

if (roomid && roomid.length) {
    document.getElementById('room-id').value = roomid;
    localStorage.setItem(connection.socketMessageEvent, roomid);

    // auto-join-room
    (function reCheckRoomPresence() {
        connection.checkPresence(roomid, function(isRoomExist) {
            if (isRoomExist) {
                connection.join(roomid);
                return;
            }

            setTimeout(reCheckRoomPresence, 5000);
        });
    })();

    disableInputButtons();
}

// detect 2G
if(navigator.connection &&
   navigator.connection.type === 'cellular' &&
   navigator.connection.downlinkMax <= 0.115) {
  alert('2G is not supported. Please use a better internet service.');
}





  
  
  
  
  
});
  



  
  
  
  
});






