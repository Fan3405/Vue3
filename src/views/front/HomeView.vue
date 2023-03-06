<template>
  <header class="container-fluid">
    <div class="row">
      <div class="col-4 text-center">
        <h2 class="lh-lg pt-8"><br /></h2>
        <h1 class="pt-5"></h1>
        <a href="#info" class="btn btn-skinColor mt-7 w-100 fw-bold"><i class="fa-solid fa-angles-down pe-1 arrow"></i>看菜單</a>
      </div>
      <div
        class="col-8 bannerRight"
        style="
          background-position: center;
          background-size: cover;
          object-fit: cover;
          min-height: 95vh;
          background-image: url('https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bWVhdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60');
        "
      ></div>
    </div>
  </header>
  <main id="info">
    <div class="pt-8">
      <div class="row g-0 justify-content-center text-white pt-9">
        <div class="col-md-2 bg-primary text-center pt-5 box">
          <p class="pt-5">
            <span class="boxText"></span>
            <span class="cursor">_</span>
          </p>
        </div>
        <div class="col-md-2 bg-primary mx-5 text-center pt-5 box2">
          <p class="pt-5">
            <span class="boxText2"></span>
            <span class="cursor2">_</span>
          </p>
        </div>
        <div class="col-md-2 bg-primary text-center pt-5 box3">
          <p class="pt-5">
            <span class="boxText3"></span>
            <span class="cursor3">_</span>
          </p>
        </div>
      </div>
    </div>
  </main>
  <footer class="bg-darkGreen">
    <div class="container text-center py-5">
      <p class="m-0 letterSpacing">聯絡我們</p>
      <a class="me-1" href="#"><i class="fa-brands fa-facebook"></i></a>
      <a href="#">
        <i class="fa-solid fa-envelope text-skinColor"></i>
      </a>
      <p class="m-0 fs-7 pt-4">Copyright©2023</p>
    </div>
  </footer>
</template>

<script>
export default {
  components: {},
  mounted() {},
};
</script>

<style scoped></style>
