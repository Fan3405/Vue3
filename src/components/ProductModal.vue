<template>
  <!-- 把productModal拉出來-->
  <div
    id="productModal"
    ref="productModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="productModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            <span>{{ isNew ? '新增產品' : '編輯產品' }}</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-2">
                <div class="mb-3">
                  <label for="imageUrl" class="form-label">輸入圖片網址</label>
                  <input
                    v-model="tempProduct.imageUrl"
                    type="text"
                    class="form-control"
                    placeholder="請輸入圖片連結"
                  />
                </div>
                <div class="mb-3">
                  <label for="customFile" class="form-label"
                    >或 上傳圖片
                    <i v-if="fileLoading" class="fas fa-spinner fa-spin"></i>
                  </label>
                  <input
                    type="file"
                    id="customFile"
                    class="form-control"
                    ref="fileInput"
                    @change="uploadFile"
                  />
                </div>
                <h4>主要圖片</h4>
                <img class="img-fluid" :src="tempProduct.imageUrl" alt="" />
              </div>
              <div>
                <h4>其他圖片</h4>

                <!-- 判斷tempProduct.imagesUrl是一個陣列 -->
                <div v-if="Array.isArray(tempProduct.imagesUrl)">
                  <template
                    v-for="(img, key) in tempProduct.imagesUrl"
                    :key="key + 123"
                  >
                    <input
                      type="text"
                      class="form-control"
                      v-model="tempProduct.imagesUrl[key]"
                    />
                    <img
                      :src="tempProduct.imagesUrl[key]"
                      alt=""
                      class="img-fluid mb-2"
                    />
                  </template>

                  <!-- 判斷新增、刪除出現的時機 -->
                  <button
                    class="btn btn-outline-primary btn-sm d-block w-100"
                    @click="tempProduct.imagesUrl.push('')"
                    v-if="
                      !tempProduct.imagesUrl.length ||
                      tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]
                    "
                  >
                    新增圖片
                  </button>
                  <button
                    class="btn btn-outline-danger btn-sm d-block w-100"
                    @click="tempProduct.imagesUrl.pop()"
                    v-else
                  >
                    刪除圖片
                  </button>
                </div>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input
                  v-model="tempProduct.title"
                  id="title"
                  type="text"
                  class="form-control"
                  placeholder="請輸入標題"
                />
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input
                    v-model="tempProduct.category"
                    id="category"
                    type="text"
                    class="form-control"
                    placeholder="請輸入分類"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <input
                    v-model="tempProduct.unit"
                    id="unit"
                    type="text"
                    class="form-control"
                    placeholder="請輸入單位"
                  />
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input
                    v-model.number="tempProduct.origin_price"
                    id="origin_price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入原價"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input
                    v-model.number="tempProduct.price"
                    id="price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入售價"
                  />
                </div>
              </div>
              <hr />

              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea
                  v-model="tempProduct.description"
                  id="description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入產品描述"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  v-model="tempProduct.content"
                  id="description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入說明內容"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    v-model="tempProduct.is_enabled"
                    id="is_enabled"
                    class="form-check-input"
                    type="checkbox"
                    :true-value="1"
                    :false-value="0"
                  />
                  <label class="form-check-label" for="is_enabled"
                    >是否啟用</label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="$emit('update-product', tempProduct)"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env;

export default {
  props: ['isNew', 'product'], // 也可用以下寫法
  // props: {
  //   product: {
  //     type: Object,
  //     default() { return {}; },
  //   },
  //   isNew: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  emits: ['update-product'],
  data() {
    return {
      productModal: null,
      tempProduct: {
        imagesUrl: [],
      },

      fileLoading: false, // 上傳檔案loading效果使用

      // 做分頁使用
      page: {},
    };
  },
  methods: {
    openModal() {
      this.productModal.show();
    },
    hideModal() {
      this.productModal.hide();
    },
    uploadFile() {
      // 解構寫法，取得input DOM位置，相當於const fileInput = this.$refs.fileInput;
      const { fileInput } = this.$refs;

      // 將檔案位置取出，也可將兩行合併寫const uploadedFile = this.$refs.fileInput.files[0];
      const file = fileInput.files[0];
      const formData = new FormData(); // 建立表單格式
      formData.append('file-to-upload', file); // 將要上傳的檔案夾帶進來’file-to-upload’是API對應的欄位，file是要上傳的檔案

      this.fileLoading = true;
      this.$http
        .post(`${VITE_APP_URL}v2/api/${VITE_APP_PATH}/admin/upload`, formData)
        .then((response) => {
          this.tempProduct.imageUrl = response.data.imageUrl;
          if (response.data.success) {
            this.$refs.fileInput.value = ''; // 上傳成功後清空上傳檔案值
            this.fileLoading = false; // 上傳檔案loading效果
            Swal.fire({
              title: '圖片上傳成功',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          }
        })
        .catch((error) => {
          this.$refs.fileInput.value = '';
          this.fileLoading = false;
          Swal.fire({
            title: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        });
    },
  },
  watch: {
    // 用watch監聽product傳入的值
    product() {
      this.tempProduct = this.product;
      if (!this.tempProduct.imagesUrl) {
        this.tempProduct.imagesUrl = [];
      }
      if (!this.tempProduct.imageUrl) {
        this.tempProduct.imageUrl = '';
      }
    },
  },
  mounted() {
    // 將bootstrap的modal實體化
    this.productModal = new Modal(this.$refs.productModal);
  },
};
</script>
