<script setup lang="ts">
  import type { GetCouponsResponse } from '@/types/coupon';
  import { Modal } from 'bootstrap';
  import { onMounted, onUnmounted, useTemplateRef } from 'vue';

  interface CouponDetailModalProps {
    coupon: GetCouponsResponse['coupons'][number];
  }

  const props = defineProps<CouponDetailModalProps>();

  const modalRef = useTemplateRef('modalRef');
  let modal: Modal | null = null;

  onMounted(() => {
    if (modalRef.value) {
      modal = new Modal(modalRef.value);
    }
  });

  onUnmounted(() => {
    if (modal) {
      modal.dispose();
    }
  });

  const openModal = () => {
    if (modal) {
      modal.show();
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.hide();
    }
  };

  defineExpose({
    openModal,
    closeModal,
  });
</script>

<template>
  <div ref="modalRef" class="modal fade" id="couponDetailModal" tabindex="-1" aria-labelledby="couponDetailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-lg">
        <div class="modal-header">
          <h5 class="modal-title" id="couponDetailModalLabel">優惠券詳細資訊</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>
            <strong>優惠券編號:</strong> <span id="modalCouponId">{{ props.coupon.id }}</span>
          </p>
          <p>
            <strong>優惠券標題:</strong> <span id="modalCouponTitle">{{ props.coupon.title }}</span>
          </p>
          <p>
            <strong>優惠碼:</strong> <span id="modalCouponCode">{{ props.coupon.code }}</span>
          </p>
          <p>
            <strong>折扣:</strong> <span id="modalCouponPercent">{{ coupon.percent / 100 }} 折</span>
          </p>
          <p>
            <strong>到期日期:</strong>
            <span id="modalCouponDueDate">{{ new Date(props.coupon.due_date * 1000).toLocaleDateString() }}</span>
          </p>
          <p>
            <strong>狀態:</strong>
            <span id="modalCouponEnabled" class="badge" :class="{ 'bg-success': coupon.is_enabled, 'bg-gray': !coupon.is_enabled }"
              >{{ coupon.is_enabled ? '啟用' : '停用' }}
            </span>
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary rounded-lg" data-bs-dismiss="modal">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
