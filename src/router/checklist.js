export default [
  {
    path: '/checklist',
    name: 'checklist',
    component: () => import('@/pages/checklist/Checklist.vue'),
  },
  {
    path: '/checklist/:id',
    name: 'checklistDetail',
    component: () => import('@/pages/checklist/ChecklistDetail.vue'),
    // props: true,
  },
  {
    path: '/checklist/create',
    name: 'checklistCreate',
    component: () => import('@/pages/checklist/ChecklistAdd.vue'),
    props: true,
  },
]
