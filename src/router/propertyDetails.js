export default [
  {
    path: '/property/:id',
    name: 'propertyDetails',
    component: () => import('@/pages/propertyDetails/PropertyDetails.vue'),
  },
]
