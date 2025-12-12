import type { Coupon } from '@/types/coupon';
import { ref, type Ref } from 'vue';

interface UseCouponFormResult {
  form: Ref<Coupon>;
  formTitle: Ref<string>;
  loadCoupon: (data: Coupon | null) => void;
  resetForm: () => void;
}

const getInitialCouponData = (): Coupon => ({
  code: '',
  due_date: 0,
  id: '',
  is_enabled: 0,
  percent: 0,
  title: '',
  num: 0,
});

export function useCouponForm(): UseCouponFormResult {
  const form = ref<Coupon>(getInitialCouponData());
  const formTitle = ref('新增優惠券');

  const loadCoupon = (data: Coupon | null): void => {
    if (data) {
      // 編輯模式：載入資料
      form.value = { ...data };
      formTitle.value = '編輯優惠券';
    } else {
      resetForm();
    }
  };

  const resetForm = (): void => {
    form.value = getInitialCouponData();
    formTitle.value = '新增優惠券';
  };

  return {
    form,
    formTitle,
    loadCoupon,
    resetForm,
  };
}
