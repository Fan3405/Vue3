<template>
  這是登入頁面
  <VueForm id="form" class="form" v-slot="{ errors }" @submit="login">
    <div class="mb-3">
      <label for="username" class="form-label">Email</label>
      <!-- name="Email"E改大小寫都可以也可改中文 -->
      <VueField
        v-model="user.username"
        id="username"
        name="Email"
        type="email"
        class="form-control"
        :class="{ 'is-invalid': errors['Email'] }"
        placeholder="請輸入 Email"
        rules="required|email"
      ></VueField>
      <ErrorMessage name="Email" class="invalid-feedback"></ErrorMessage>
    </div>

    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <VueField
        v-model="user.password"
        id="password"
        name="password"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': errors['password'] }"
        placeholder="請輸入密碼"
        rules="required"
      ></VueField>
      <ErrorMessage name="password" class="invalid-feedback"></ErrorMessage>
    </div>

    <div class="text-end">
      <button type="submit" class="btn btn-lg btn-primary w-100 mt-3">
        登入
      </button>
    </div>
  </VueForm>
</template>

<script>
import Swal from 'sweetalert2';
// 引入sweet alert2套件
const { VITE_APP_URL } = import.meta.env;
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      this.$http
        .post(`${VITE_APP_URL}v2/admin/signin`, this.user)
        .then((response) => {
          // 解構寫法，從response.data裡面取出token、expired
          const { token, expired } = response.data;

          // 將token、expired存進cookie
          document.cookie = `myToken=${token}; myexpired=${new Date(
            expired,
          )}; `;
          Swal.fire({
            title: response.data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
          //   window.location = 'product.html';
          this.$router.push('/admin/adminProducts'); // 登入成功轉址到後台產品列表
        })
        .catch((error) => {
          Swal.fire({
            title: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        });
    },
  },
  mounted() {},
};
</script>
