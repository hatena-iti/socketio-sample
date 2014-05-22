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

// socket.io接続
var socket = io.connect();

// 接続時
socket.on('connect', function() {
	// ログイン通知
	emit('login');
});

// 切断時
socket.on('disconnect', function(client) {
});

// 受信時
socket.on('recieve', function(data) {
	var item = $('<li>').append($('<small>').append(data.time));

	// data.typeを解釈し、要素を生成する
	if (data.type === 'login') {
		item.addClass('alert alert-success').append($('<div>').append(data.user + 'がログインしました'));
	} else if (data.type === 'logout') {
		item.addClass('alert alert-danger').append($('<div>').append(data.user + 'がログアウトしました'));
	} else if (data.type === 'chat') {
		var msg = data.value.replace(/[!@$%<>'"&|]/g, '');
		item.addClass('well well-lg').append($('<div>').text(msg)).children('small').prepend(data.user + '：');
	} else {
		item.addClass('alert alert-danger').append($('<div>').append('不正なメッセージを受信しました'));
	}

	$('#chat-area').prepend(item).hide().fadeIn(800);
});

// イベント発信
function emit(type, msg) {
	socket.emit('notice', {
		type : type,
		user : $('#username').val(),
		value : msg,
	});
}

// クライアントからメッセージ送信
function sendMessage() {
	// メッセージ取得
	var msg = $('#message').val();
	// 空白にする
	$('#message').val("");
	// メッセージ通知
	emit('chat', msg);
}

// イベントの登録
$(document).ready(function() {
	$(window).on('beforeunload', function(e) {
		// ログアウト通知
		emit('logout');
	});

	// 送信ボタンのコールバック設定
	$('#send').click(sendMessage);
});
