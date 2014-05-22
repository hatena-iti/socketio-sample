/* Copyright 2013 Intelligent Technology Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var socketio = require('socket.io');
var dateformat = require('dateformat');

module.exports = sio;

function sio(server) {
	// Socket.IO
	var sio = socketio.listen(server);
	sio.set('transports', [ 'websocket' ]);

	// 接続時
	sio.sockets.on('connection', function(socket) {

		// 通知受信
		socket.on('notice', function(data) {
			// すべてのクライアントへ通知を送信
			// ブロードキャスト
			socket.broadcast.emit('recieve', {
				type : data.type,
				user : data.user,
				value : data.value,
				time : dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
			});
		});

		// 切断時
		socket.on("disconnect", function() {
		});
	});
}
