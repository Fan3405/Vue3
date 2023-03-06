<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-primary sticky-top px-5">
    <RouterLink to="/" class="navbar-brand fs-1">Home</RouterLink>
    <!-- RWD button -->
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNavAltMarkup"
      aria-controls="navbarNavAltMarkup"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
      <ul class="navbar-nav">
        <li class="nav-item">
          <RouterLink to="/about" class="nav-link me-4 active">About</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/products" class="nav-link me-4">產品列表</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/cart" class="nav-link me-4 position-relative"
            ><i class="fas fa-shopping-cart"></i>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger">
              {{ carts.length }}</span
            >
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/admin/adminProducts" class="nav-link">登入後台</RouterLink>
        </li>
      </ul>
    </div>
  </nav>

  <RouterView />
</template>
<script>
import { mapActions, mapState } from 'pinia';
import cartStore from '../stores/cartStore';

export default {
  computed: {
    // 在computed用mapState取得cartStore裡的資料
    ...mapState(cartStore, ['carts']),
  },
  methods: {
    // 在methods用mapActions取得cartStore裡的方法
    ...mapActions(cartStore, ['getCarts']),
  },
  mounted() {
    this.getCarts();
  },
};
</script>
