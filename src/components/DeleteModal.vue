<template>
  <div
    id="delProductModal"
    ref="delProductModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="delProductModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>{{ isOrder ? '刪除訂單' : '刪除產品' }}</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong v-if="isOrder" class="text-danger"
            >{{ tempOrder.user.email }}訂單</strong
          >
          <strong v-else class="text-danger"
            >{{ tempProduct.title }}商品</strong
          >
          (刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="deleteProduct">
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal';

export default {
  props: ['tempProduct', 'deleteProduct', 'isOrder', 'tempOrder'],
  data() {
    return {
      delProductModal: null,
    };
  },
  methods: {
    opendelModal() {
      this.delProductModal.show();
    },
    hidedelModal() {
      this.delProductModal.hide();
    },
  },
  mounted() {
    // 將bootstrap刪除的modal實體化
    this.delProductModal = new Modal(this.$refs.delProductModal);
  },
};
</script>
