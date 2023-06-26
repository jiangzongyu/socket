<template>
  <div class="container">
    <div class="header">{{ receiverInfo.user?.name }}</div>
    <div class="chat-content">
      <template v-if="chatList && chatList.length">
        <div
          v-for="(chat, index) in chatList"
          class="message-box"
          :class="{'right-message': chat.user?.id === userInfo.user?.id}"
          :key="index"
        >
          <div v-if="chat.user?.id !== userInfo.user?.id" class="user">
            <el-avatar  class="avatar" :src="chat.user?.avatar" ></el-avatar>
            <div class="info">
              <div class="name">{{chat.user?.name}}</div>
              <div class="time">{{chat.createTime}}</div>
            </div>
          </div>
          <div v-else class="user">
            <div class="info">
              <div class="time">{{chat.createTime}}</div>
              <div class="name">{{chat.user?.name}}</div>
            </div>
            <el-avatar  class="avatar" :src="chat.user?.avatar" ></el-avatar>
          </div>
          <div class="message">
            <div :class="{block: true, 'block-color': chat.user?.id === userInfo.user?.id}">{{chat.message}}</div>
          </div>
        </div>
      </template>
      <div v-else class="empty">
<!--        没有消息-->
      </div>
    </div>
    <div class="chat-bottom">
      <el-input v-model="chatMsg" class="chat-input" placeholder="请输入内容" />
      <el-button class="chat-btn" type="primary" :disabled="!chatMsg" @click="sendMsg">send</el-button>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, reactive } from 'vue';
import io from 'socket.io-client';
import { useRoute } from 'vue-router';
import userOneImg from '../assets/1.jpeg';
import userTwoImg from '../assets/2.jpeg';
import userThreeImg from '../assets/3.jpg';

const userList = [
  { name: '用户1', id: '1', avatar: userOneImg },
  { name: '用户2', id: '2', avatar: userTwoImg },
  { name: '用户3', id: '3', avatar: userThreeImg },
];

export default {
  name: 'HomePage',
  setup() {
    const route = useRoute();
    const chatList = ref([]);
    const chatMsg = ref('');
    const userInfo = reactive({ user: userList[0] });
    const receiverInfo = reactive({ user: {} });
    let socket;
    onMounted(() => {
      socket = io('ws://localhost:3001');
      socket.on('connect', () => {
        console.log(socket.id, '监听客户端连接成功');
      });
      socket.on('fresh-message', (data) => {
        console.log(data);
        chatList.value = data;
      });
    });
    userInfo.user = userList.find((item) => item.id === route.query.userId);
    receiverInfo.user = userList.find((item) => item.id === route.query.receiverId);
    const sendMsg = () => {
      socket.emit('send-message', userInfo.user, chatMsg.value);
      chatMsg.value = '';
    };

    return {
      chatMsg,
      chatList,
      userList,
      userInfo,
      receiverInfo,
      sendMsg,
    };
  },
};
</script>

<style lang="scss" scoped>
@mixin flex($align) {
  display: flex;
  align-items: $align;
}
.container {
  //width: 100%;
  height: 700px;
  padding: 24px;
  overflow: hidden;
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
  }
}
.chat-bottom {
  @include flex(center)
}
.chat-content {
  height: 600px;
  padding: 10px;
  border: 1px solid #ddd;
  border-bottom: none;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
  .message-box  {
    margin-bottom: 10px;
    .message {
      width: 100%;
      margin-left: 42px;
      border-radius: 4px;
      box-sizing: border-box;
      margin-top: 5px;
      .block {
        display: inline-block;
        font-size: 14px;
        line-height: 1.5;
        border-radius: 4px;
        padding: 8px;
        background-color: #eee;
      }
      .block-color {
        background-color: #3ecf7c;
      }
    }
    .user {
      .avatar {
        width: 32px;
        height: 32px;
        margin-right: 10px;
      }
      @include flex(center);
    }
    .info {
      @include flex(center);
      font-size: 12px;
      color: #999;
      .name {
        margin-right: 10px;
      }
    }
    &.right-message {
      text-align: right;
      .message {
        padding-right: 42px;
        margin-left: auto;
      }
      .user {
        .name { margin-right: 0px; margin-left: 10px; }
        justify-content: flex-end
      }
      .avatar {
        margin-right: 0px;
        margin-left: 10px;
      }
    }
  }
}
.empty {
  font-size: 14px;
  padding: 50px 0;
  text-align: center;
}
.chat-input {
  &:deep(.el-input__inner) {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
.chat-btn {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
