import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { GlobalErrorHandler } from './utils/error-handling';

// 初始化全局错误处理
GlobalErrorHandler.getInstance();

const app = createApp(App);

app.use(router);
app.use(ElementPlus);

app.mount('#app');
