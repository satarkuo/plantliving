<script setup lang="ts">
  import { apiCreateCoupon, apiEditCoupon } from '@/api/coupon';

  import type { GetCouponsResponse } from '@/types/coupon';
  import { useCouponForm } from '@/composable/useCouponData';

  import type { Coupon } from '@/types/coupon';

  import { Modal } from 'bootstrap';
  import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';

  interface CouponModalProps {
    coupon: Coupon;
  }

  const { coupon } = defineProps<CouponModalProps>();
  const emit = defineEmits(['get-coupons']);

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

  const { form, formTitle, loadCoupon } = useCouponForm();
  console.log('form =>', form);
  watch(
    () => coupon,
    newCoupon => {
      if (newCoupon.id) {
        loadCoupon(newCoupon);
      } else {
        loadCoupon(null);
        form.value.is_enabled = 1;
      }
    },
    { immediate: true, deep: true },
  );
  const isEditMode = computed(() => Boolean(coupon.id));

  const isLoading = ref(false);

  const dueDateInput = computed<string>({
    get() {
      if (!form.value.due_date) return '';
      return new Date(form.value.due_date * 1000).toISOString().slice(0, 10); // YYYY-MM-DD
    },
    set(value) {
      if (!value) {
        form.value.due_date = 0;
      } else {
        form.value.due_date = Math.floor(new Date(value).getTime() / 1000);
      }
    },
  });

  const saveCoupon = async () => {
    const { id, num, ...coupon } = form.value;

    const data = {
      ...coupon,
    };

    isLoading.value = true;

    try {
      if (isEditMode.value && id) {
        await apiEditCoupon({ data, id });
      } else {
        await apiCreateCoupon(data);
      }
      closeModal();
    } catch (error) {
      alert('新增/編輯優惠券失敗');
    } finally {
      isLoading.value = false;
      emit('get-coupons');
    }
  };

  defineExpose({
    openModal,
    closeModal,
  });
</script>

<template>
  <div ref="modalRef" class="modal fade" id="couponDetailModal" tabindex="-1" aria-labelledby="couponDetailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content rounded-lg">
        <div class="modal-header">
          <h5 class="modal-title" id="couponDetailModalLabel">{{ formTitle }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p v-if="isEditMode">
            <strong>ID編號</strong>
            <span id="modalCouponId"
              ><small class="text-secondary ms-2">{{ coupon.id }}</small></span
            >
          </p>
          <form>
            <div class="row">
              <div class="col-6">
                <div class="mb-3">
                  <label for="couponName" class="form-label"><strong>優惠券標題</strong></label>
                  <input v-model="form.title" type="text" class="form-control rounded-lg" id="couponName" placeholder="請輸入優惠券標題" />
                </div>
                <div class="mb-3">
                  <label for="couponPercent" class="form-label"
                    ><strong>折扣<small class="text-muted ms-1">（1–99，例: 80 = 8 折）</small></strong></label
                  >
                  <input v-model.number="form.percent" type="number" min="1" max="99" class="form-control rounded-lg" id="couponPercent" />
                </div>
                <div class="mb-3 d-flex align-items-center">
                  <strong class="me-3">狀態</strong>

                  <div class="form-check form-switch">
                    <input
                      v-model="form.is_enabled"
                      class="form-check-input"
                      type="checkbox"
                      id="couponEnabledSwitch"
                      :true-value="1"
                      :false-value="0"
                    />
                    <label class="form-check-label" for="couponEnabledSwitch">
                      {{ form.is_enabled ? '啟用' : '停用' }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="mb-3">
                  <label for="couponCode" class="form-label"><strong>優惠碼</strong></label>
                  <input v-model="form.code" type="text" class="form-control rounded-lg" id="couponCode" placeholder="請輸入優惠碼" />
                </div>
                <div class="mb-3">
                  <label for="couponDueDate" class="form-label"><strong>到期日期</strong></label>
                  <input
                    v-model="dueDateInput"
                    type="date"
                    class="form-control rounded-lg"
                    id="couponDueDate"
                    placeholder="請選擇到期日期"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" type="button" class="btn btn-outline-secondary rounded-lg">取消</button>
          <button @click="saveCoupon" :disabled="isLoading" type="button" class="btn btn-dark rounded-lg">儲存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
