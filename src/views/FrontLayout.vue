<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-primary sticky-top">
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
    <div
      class="collapse navbar-collapse justify-content-end"
      id="navbarNavAltMarkup"
    >
      <ul class="navbar-nav">
        <li class="nav-item">
          <RouterLink to="/about" class="nav-link me-4 active"
            >About</RouterLink
          >
        </li>
        <li class="nav-item">
          <RouterLink to="/products" class="nav-link me-4">產品列表</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/cart" class="nav-link me-4">購物車</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/cart" class="nav-link me-4"
            ><i class="fas fa-shopping-cart"></i
          ></RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/admin/adminProducts" class="nav-link"
            >登入後台</RouterLink
          >
        </li>
      </ul>
    </div>
  </nav>

  <RouterView />
</template>
<script></script>
