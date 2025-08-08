export default [
  {
    path: '/property/:id',
    name: 'favorite',
    component: () => import('@/pages/propertyDetails/PropertyDetails.vue'),
    props: true,
  },
]
