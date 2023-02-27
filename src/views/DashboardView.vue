<template>
  這是後台頁面
  <RouterLink to="/admin/adminProducts">後台產品列表</RouterLink> |
  <RouterLink to="/admin/adminOrders">後台訂單列表</RouterLink> |
  <RouterLink to="/">回前台首頁</RouterLink> |
  <a href="#" @click.prevent="logout">登出</a>
  <hr />
  <RouterView />
</template>
<script>
import Swal from 'sweetalert2';
// 引入sweet alert2套件
const { VITE_APP_URL } = import.meta.env;
export default {
  methods: {
    logout() {
      // 在點擊登出時把登入存的cookie清除掉
      document.cookie = `myToken=; myexpired=${new Date()}; `;

      Swal.fire({
        title: '已登出',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      this.$router.push('/login');
    },
    checkAdmin() {
      // 取出 token
      const cookieValue = document.cookie.replace(
        /(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1',
      );
      // 每次都會帶入
      this.$http.defaults.headers.common.Authorization = cookieValue;

      if (cookieValue) {
        this.$http
          .post(`${VITE_APP_URL}v2/api/user/check`)
          .then(() => {})
          .catch((error) => {
            Swal.fire({
              title: error.response.data.message,
              icon: 'error',
              confirmButtonText: 'OK',
            });
            this.$router.push('/login');
          });
      } else {
        Swal.fire({
          title: '您尚未登入',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        this.$router.push('/login');
      }
    },
  },
  mounted() {
    this.checkAdmin();
  },
};
</script>
