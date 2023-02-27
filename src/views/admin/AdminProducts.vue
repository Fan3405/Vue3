<template>
  這是後台產品列表
  <div class="container">
    <div class="text-end mt-4">
      <button class="btn btn-primary" @click="openModal('createNew')">
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.category }}</td>
          <td>{{ product.title }}</td>
          <td class="text-end">{{ product.origin_price }}</td>
          <td class="text-end">{{ product.price }}</td>
          <td>
            <span class="text-success" v-if="product.is_enabled">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="openModal('edit', product)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="openModal('delete', product)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 將註冊的元件以html標籤方式加入畫面就可顯示、
             用props將資料傳進來前面屬性要放內層自訂的名稱，後面值要放外層資料，但html不能使用大寫所以要寫成get-data、
             也可使用emit寫法@change-page="getData"，(props是傳資料、emit是傳事件) -->
    <PaginationComponent
      :pages="page"
      :get-data="getData"
    ></PaginationComponent>
  </div>

  <!-- Modal -->
  <div
    id="productModal"
    ref="productModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="productModalLabel"
    aria-hidden="true"
  >
    <!-- 將全域註冊元件以html標籤方式寫入，但如果只用<product-modal/>在html模式下可能會被判斷沒有結尾 -->
    <product-modal
      :temp-product="tempProduct"
      :update-product="updateProduct"
    ></product-modal>
  </div>

  <!-- 全域註冊delProductModal刪除元件 -->
  <DeleteModal
    ref="delProductModal"
    :temp-product="tempProduct"
    :delete-product="deleteProduct"
  ></DeleteModal>

  <!-- Modal -->
</template>

<script>
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import PaginationComponent from '../../components/PaginationComponent.vue';
import DeleteModal from '../../components/DeleteModal.vue';

const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env;
export default {
  data() {
    return {
      productModal: null,
      delProductModal: null,
      products: [],
      tempProduct: {
        imagesUrl: [],
      },

      //   確認是新增或是編輯所使用的
      isNew: false,

      // 做分頁使用
      page: {},
    };
  },
  methods: {
    getData(page = 1) {
      // page=1設定參數預設值，如果沒有設定參數預設值的話page會是undefined
      this.$http
        .get(
          `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/admin/products?page=${page}`,
        )
        .then((response) => {
          this.products = response.data.products;

          // 將分頁功能儲存
          this.page = response.data.pagination;
        })
        .catch((error) => {
          Swal.fire({
            title: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        });
    },
    openModal(status, product) {
      if (status === 'createNew') {
        // 打開新增modal
        this.productModal.show();
        this.isNew = true;

        // 如果是新增產品會帶入初始資料
        this.tempProduct = {
          imagesUrl: [],
        };
      } else if (status === 'edit') {
        // 打開編輯modal
        this.productModal.show();
        this.isNew = false;

        // 如果是編輯產品會帶入當前要編輯的資料
        this.tempProduct = { ...product };
      } else if (status === 'delete') {
        // 打開刪除modal
        this.delProductModal.show();
        this.tempProduct = { ...product }; // 取id使用
      }
    },
    deleteProduct() {
      this.$http
        .delete(
          `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/admin/product/${this.tempProduct.id}`,
        )
        .then((response) => {
          Swal.fire({
            title: response.data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.getData();
          this.delProductModal.hide();
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
  mounted() {
    this.getData();

    // // 將bootstrap新增、編輯的modal實體化
    this.productModal = new Modal(document.querySelector('#productModal'));

    // // 將bootstrap刪除的modal實體化
    this.delProductModal = new Modal(this.$refs.delProductModal);
  },
  components: {
    PaginationComponent,
    DeleteModal,
  },
};
</script>
