<script setup lang="ts">
  import { apiDeleteCoupon, apiGetCoupons } from '@/api/coupon';
  import DeleteModal from '@/components/DeleteModal.vue';
  import CouponDetailModal from '@/components/CouponModal.vue';
  import type { Coupon, Pagination } from '@/types/coupon';
  import { watch, ref, useTemplateRef } from 'vue';

  const couponDetailModalRef = useTemplateRef('couponDetailModalRef');
  const deleteModalRef = useTemplateRef('deleteModalRef');
  const createEmptyCoupon = (): Coupon => ({
    code: '',
    due_date: 0,
    id: '',
    is_enabled: 0,
    percent: 0,
    title: '',
    num: 0,
  });
  const tempCoupon = ref<Coupon>(createEmptyCoupon());

  const currentPage = ref('1');

  const coupons = ref<Coupon[]>([]);

  const pagination = ref<Pagination>({
    total_pages: 0,
    current_page: 0,
    has_pre: false,
    has_next: false,
    category: '',
  });

  const getCoupons = async () => {
    try {
      const res = await apiGetCoupons({
        page: currentPage.value,
      });

      coupons.value = res.data.coupons;
      pagination.value = res.data.pagination;
    } catch (error) {
      alert('取得優惠券列表失敗');
    }
  };
  watch(currentPage, getCoupons, { immediate: true });

  const openModal = (coupon: Coupon | null = null) => {
    tempCoupon.value = coupon
      ? { ...coupon }
      : {
          code: '',
          due_date: 0,
          id: '',
          is_enabled: 0,
          percent: 0,
          title: '',
          num: 0,
        };
    couponDetailModalRef.value?.openModal();
  };

  const openDeleteModal = (couponId: string) => {
    deleteModalRef.value?.openModal(() => deleteCoupon(couponId));
  };

  const deleteCoupon = async (couponId: string) => {
    try {
      await apiDeleteCoupon(couponId);
    } catch (error) {
      alert('刪除優惠券失敗');
    } finally {
      getCoupons();
    }
  };
</script>

<template>
  <div class="d-flex justify-content-end align-items-center mb-4">
    <button @click="openModal(null)" type="button" class="btn btn-dark rounded-lg px-4 py-2">
      <i class="fas fa-plus me-2"></i>新增優惠券
    </button>
  </div>
  <div class="card shadow-sm rounded-lg flex-grow-1">
    <div class="card-body p-4">
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">項目</th>
              <th scope="col">標題 <small class="text-secondary">| ID 編號</small></th>
              <th scope="col">優惠碼</th>
              <th scope="col">折扣</th>
              <th scope="col">到期日期</th>
              <th scope="col">啟用狀態</th>

              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="coupon in coupons" :key="coupon.id">
              <td>{{ coupon.num }}</td>
              <td>
                {{ coupon.title }}<br /><small class="text-secondary">{{ coupon.id }}</small>
              </td>
              <td>{{ coupon.code }}</td>
              <td>{{ coupon.percent / 10 }} 折</td>
              <td>{{ new Date(coupon.due_date * 1000).toLocaleDateString('zh-TW') }}</td>
              <td>
                <span class="badge" :class="{ 'bg-success': coupon.is_enabled, 'bg-light text-secondary': !coupon.is_enabled }">{{
                  coupon.is_enabled ? '啟用' : '停用'
                }}</span>
              </td>

              <td class="text-nowrap">
                <button @click="openModal(coupon)" type="button" class="btn btn-sm btn-outline-dark rounded-lg me-2">查看</button>
                <button @click="openDeleteModal(coupon.id)" type="button" class="btn btn-sm btn-outline-danger rounded-lg">刪除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <nav class="d-flex justify-content-center mt-4">
        <ul class="pagination">
          <li class="page-item">
            <button
              @click="currentPage = String(Number(currentPage) - 1)"
              :disabled="!pagination?.has_pre"
              type="button"
              class="page-link"
              :class="{ disabled: !pagination?.has_pre }"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          <li v-for="pageNum in pagination?.total_pages" class="page-item">
            <button
              @click="currentPage = pageNum.toString()"
              :disabled="currentPage === pageNum.toString()"
              type="button"
              class="page-link"
              :class="{ active: currentPage === pageNum.toString() }"
            >
              {{ pageNum }}
            </button>
          </li>
          <li class="page-item">
            <button
              @click="currentPage = String(Number(currentPage) + 1)"
              :disabled="!pagination?.has_next"
              class="page-link"
              :class="{ disabled: !pagination?.has_next }"
              type="button"
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <CouponDetailModal ref="couponDetailModalRef" :coupon="tempCoupon" @get-coupons="getCoupons" />
  <DeleteModal ref="deleteModalRef" title="刪除優惠券" content="確定要刪除該優惠券嗎？" />
</template>

<style lang="scss" scoped></style>
