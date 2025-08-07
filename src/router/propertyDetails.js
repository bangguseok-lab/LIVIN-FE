export default [
  {
    path: '/property/:id',
    name: 'PropertyDetails',
    component: () => import('@/pages/propertyDetails/PropertyDetails.vue'),
    props: true,
  },
]
