import { Product, Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'reeles', name: 'Reeles' },
  { id: 'cañas', name: 'Cañas' },
  { id: 'señuelos', name: 'Señuelos' },
  { id: 'anzuelos', name: 'Anzuelos' },
  { id: 'camping', name: 'Camping' },
  { id: 'accesorios', name: 'Accesorios' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Reel Rotativo Shimano Curado DC',
    description: 'Reel de alta gama con sistema de freno digital (Digital Control) para lanzamientos perfectos sin enredos.',
    price: 195000,
    originalPrice: 250000,
    category: 'reeles',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKoC7kDQqCPUIbsvc-fArjCmAA7IfgvaOBsNFjgjAllw8g25Fyed4F80sEKcimaT6KsymD61MACMaMgLpOij8WfW58b_dsa4SZoB1sIKYos4ySKMXtHBv1tQeJvesEO-dYOVeL_Tbflruzozr5KJaV9QRYlABFxcJ4MNKC1mOHUloag1aJJ9U8H5JAbJDooNUSBpN5DP1qZOPi3jgYmA1uXWZeyL4d5G_YGQP6o5WK4uiVRbVdSx15YQR0S4IRYNyFF8r2Nz_pNP4',
    stockStatus: 'InStock',
    tag: 'PRECIO AMIGO',
    rating: 4.8,
    reviewCount: 34,
    modelOptions: ['Manija Derecha', 'Manija Izquierda']
  },
  {
    id: 'p2',
    name: 'Caja Señuelos Dorados Premium (x5)',
    description: 'Variedad de señuelos seleccionados de alta vibrabilidad y colores atractivos para activar el pique de Dorados y Surubíes.',
    price: 62000,
    originalPrice: 85000,
    category: 'señuelos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa5U9OJs2_CMdb-CE2RfOf-bhfPx2hlT8-BnSGAY2lCgkM5mKyk10qf-FoXk1s4izFyMMaQ4qm19KZy5vDu0gBvXwBkKgPHZ8pq8hTyAwHi1cy6SOM55waRR3nfpQxs7YaHdh3YPN_hRmWe_rpE9SVEUn3FNs-fg3at_7cmFN-OWektCPIYjtr7KItu6bG9zD4VaYNHEt9KHsFs5uqwu-YpkARhWe_AEzjadw28n3ScCm1O8c-2K06Wq50jEos-Heq7Fb1ApRX5eg',
    stockStatus: 'InStock',
    tag: 'PRECIO AMIGO',
    rating: 4.7,
    reviewCount: 18
  },
  {
    id: 'p3',
    name: 'Caña Baitcasting Marine Sports 2.10m',
    description: 'Caña de grafito de alta resistencia ligera de acción rápida ideal para pesca de precisión técnica.',
    price: 98500,
    originalPrice: 120000,
    category: 'cañas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ8eVwezaTWt_yvQIqFgBI00_Ex0JvkzPrNWDr8DLCVGqz9zC01nT61YyU0nGgiugRgXGnXLFtpaJ6EdZjub1IKIE-koyIlw8idszXwq6TagS99Jl89feWe-ZZoiamIz-dK7fGvo20bN0nTtJAwRf4M5UiElkW_A2_LDwke7eth1-qOttz3ITgpddMhdrywfiZRvQulPbJn71dl90kx9HnMUyb_09psf7qDT3pLy_YY4iRvWSJJCRoJftqwhgyN2aYK4KGM4AAq7Y',
    stockStatus: 'InStock',
    tag: 'PRECIO AMIGO',
    rating: 4.6,
    reviewCount: 22
  },
  {
    id: 'p4',
    name: 'Conservadora Coleman Rugged 50QT',
    description: 'Conservadora militar reforzada con ruedas todoterreno para preservar alimentos y capturas frescas.',
    price: 145000,
    originalPrice: 180000,
    category: 'camping',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjKbMMR-nOMiYFJCedWNUyAnVAuQAusz5vqBTpTBnCPtmUXitdJS2EgJWMLEgHGr9qdDnyCGvLcz7nEFu29TMJ-FeHXd8k6IdfKZXscec7cYLSyE5-CMDYoLUWUnXOnXPNrpGIR9I-ozojRfpCdPn9p0QzdAdILdRfX7eXBBGQw67IoAy-wVUF3EkOIUA7iw6F5oVbbu3Qbxl5pNUKQHSddBLh6VMY7xvG2JTfla4khDOox6UHj5ekyR9QR1g_YX5iCE0m-cOd-dw',
    stockStatus: 'InStock',
    tag: 'PRECIO AMIGO',
    rating: 4.9,
    reviewCount: 41
  },
  {
    id: 'p5',
    name: 'Mustad UltraPoint',
    description: 'Anzuelo de acero al carbono de alta resistencia. Forjado especial para máxima durabilidad en condiciones extremas.',
    price: 2500,
    category: 'anzuelos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYAzoi6keyHfIazTAxBCUaLpRqobb1aypaCev8RXaC6klkgZEbR5fTCXpOjU34rjE3UXnyZxMfJ2oGUjmpgGXiuFSUt6rIvCVEDEfJYSf65ECSSduUm4euzuM1U7dlThcxuV4neBZq-i92JPu0e49ZlW2Mgq1fHXoZ5iPSrP7xX0jc-APvvwNqflD92ayf2wp8YX4vDccvx3-bKJAJMfPwWXK6Slwo9ZTZMszl3hzBrJbVpLkRtxZpf3fFgLE_JMZqYl0-UN4f984',
    stockStatus: 'InStock',
    tag: 'Nuevo',
    rating: 4.5,
    reviewCount: 12,
    specs: [
      { name: 'Tamaño', value: '5/0' },
      { name: 'Unidades por paquete', value: '10' },
      { name: 'Acabado', value: 'Black Nickel' }
    ]
  },
  {
    id: 'p6',
    name: 'Owner Mutu Light',
    description: 'Circle hook ligero y sumamente filoso para pesca deportiva y devolución cuidadosa.',
    price: 3100,
    category: 'anzuelos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD89x1uUV_sk2ebxUipK_9zbF1TA_sh2TwbmXxPeDQmn2MhN5LE9P51FhVE2GSUxyYEl0nMNgbuZ00WqQ70zMlQlvkLhJuyiyuXhlodxrMqul_uKRS5vZ4ykWo9y7-vhsljrZhLM0rYEWhp8gdFvUxPlaYx39ZFfIg5PXp8LsuVVfLRxOl9kVtvrhtWL-8_Lx7NOLPoKDVAVH0sS5euDMcFOcbD5yFeLrMy5NdG4JFkbEu5THGj8UgD2dZQpF0gmpkK4YGtsFsO_E0',
    stockStatus: 'InStock',
    rating: 4.7,
    reviewCount: 9,
    specs: [
      { name: 'Tamaño', value: '3/0' },
      { name: 'Unidades por paquete', value: '8' },
      { name: 'Acabado', value: 'Fine Wire Carbon' }
    ]
  },
  {
    id: 'p7',
    name: 'Gamakatsu Octopus',
    description: 'Diseño clásico y versátil de extrema resistencia para pescar múltiples especies de río.',
    price: 2800,
    category: 'anzuelos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsWUG0mS29ReMqJ5kDhVdijFabCHa0nEmGG0MYd2glSMTZuEBSVxm6WFTsMUwp0y8GHToki3TJd77IvnvwulSnsTFL90g19ZCXqhw5WTPPC9jA7SSV8YFP47Ppgndb3u03w80CfwcJCXWJ-Wv8wkcE21jlZ3VLvYb0x12IHgzSg-D98UqrSQWvpBTSdPIKQntOpLfBIbWE4DOhlCP1_Roh0iBWOQRHIrM2EhFXC-uXUOLRonwy6YOsHdi-Lu0sKnu-vdqLDSBTdKo',
    stockStatus: 'OutOfStock',
    tag: 'Sin Stock',
    rating: 4.4,
    reviewCount: 15,
    specs: [
      { name: 'Tamaño', value: '4/0' },
      { name: 'Unidades por paquete', value: '10' },
      { name: 'Acabado', value: 'Forged Steel' }
    ]
  },
  {
    id: 'p8',
    name: 'Laguna Professional Series Edition 2024',
    description: 'El Laguna Professional Series es el resultado de dos años de desarrollo junto a guías de pesca del litoral argentino. Su chasis de aluminio de una sola pieza ofrece la rigidez necesaria para soportar las embestidas de dorados y surubíes de gran porte.',
    price: 185000,
    originalPrice: 210000,
    category: 'reeles',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1ET6wi5LycTKA7ickBSNMkrPUaGSqrxKoyYjK5vZ4HNplydu02UPrUc2Q8wwrwtgF80-2wv7F61bzrrhyvnbrBK7Fb-q-Yz-z9tZ5Chyfcm1bhg6gVaEAY6VxTFONjBwi6Dm5wYLKkqZG0dOvfNOdza5jtL4r9fnJXU_sa1AmHw1gqsgnBPmTLmD3I1aO9GWgK9s38hRca0FSBPqCYnfssGGArwfifSU-BsRDqf_EW1ElJXgCnLoAUky2Ex2LmGYxTeAUoJf-k7U',
    thumbnails: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1ET6wi5LycTKA7ickBSNMkrPUaGSqrxKoyYjK5vZ4HNplydu02UPrUc2Q8wwrwtgF80-2wv7F61bzrrhyvnbrBK7Fb-q-Yz-z9tZ5Chyfcm1bhg6gVaEAY6VxTFONjBwi6Dm5wYLKkqZG0dOvfNOdza5jtL4r9fnJXU_sa1AmHw1gqsgnBPmTLmD3I1aO9GWgK9s38hRca0FSBPqCYnfssGGArwfifSU-BsRDqf_EW1ElJXgCnLoAUky2Ex2LmGYxTeAUoJf-k7U',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD5IEm7AdApOFTrKYvjvejjLwUpIR20iYJv2TMtlAHnisdO9ungSEVIidUTldxtejBWUgbqvmwa19W18n1esy3W9viAxcZzu9nym71e1-rnH5-jfTAhgRoJkt0eYY12ToH1CW2k32yE923iZ8HcghJKdxqVe5etBlXHNO8UzIsRhpO2cCIvtVucW6JgnHhpoE132ifITcN3tVTDysEsUQYIXa5nzKnNayEpdVsBN-WQuv_aCruqjpQ0Qz8s3DVzSMQS_t9l6pwOeIc',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDuiuqxsaUph1XjxD5EybQGfoKMNZKD4lAtx3r-uGO1QI9XMBjZjMq6FYUbuB51xaxo6xm1DDhvcNweEPar9Cu8PoOiKUA_ipigXmmQKTMqe5wpzxhwEPA3BngZg6dFGpxJm8jY09_QDE0qoBzE99mvxmAdvo-mISPknxatmGt4nSq-PZALHRPT5gGXct_qhP3ZrlIodhXSWhrqrVvvCXXLFJ3-N30b1pQt_qsefNW4bbIMyykk4VbH6t0bo2b_jqFpktfzQWR0xLc',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAEIVmZVyLnEdQNpbkH3M7wwziGME3d7wrINmAJ948DTdwh9pY6hMXBIdgFrqu6OiRbm_6ubU-5fF-CScWE7SOvkcEgYerhQkDC5e8AwCusMpnSbVIibStrQDGJrg4wI7qF45P-yZKxoof-QBWxtoAQ5HJK97v9nsPNJLwd5CshnBtahcV7G7xz_LNKC2BVAGtM02l60Be0wp8SrCMV0yr7Bpb-oSwMqiLqFQUhWK9jCD-wYW2Ebx95sKFgLyqB85uxF8r-I6VNNKA'
    ],
    stockStatus: 'InStock',
    tag: 'Elección Pro-Staff',
    rating: 4.8,
    reviewCount: 12,
    modelOptions: ['7.1:1 (Derecho)', '7.1:1 (Zurdo)', '8.1:1 (Derecho)', '8.1:1 (Zurdo) - Sin Stock'],
    specs: [
      { name: 'Chasis', value: 'Aluminio Monobloque' },
      { name: 'Rodamientos', value: '10+1 Inoxidables' },
      { name: 'Freno Máximo (Drag)', value: '8 kg (Carbontex)' },
      { name: 'Capacidad de Línea', value: '0.30mm / 140m' },
      { name: 'Peso', value: '215 g' },
      { name: 'Sistema de Freno', value: 'Magnético de 10 pines' }
    ]
  },
  {
    id: 'p9',
    name: 'Bolso Estanco Waterdog 40L',
    description: 'Bolso ultra resistente 100% termosellado impermeable ideal para proteger equipamiento, ropa y electrónica de salpicaduras del río Paraná.',
    price: 85000,
    category: 'accesorios',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB03cMsjuMY00cm1qzsXiquVa_zdHCmIJU98WZrd1-V5Z4tiIqC1iyWZSak2vSA1rCbVTZLMl84_I_eDku68Jy39jITHiaXkjgn7aR4YGZ2mp9VrM77qXLORIHJsFsFfNWNNTgkCaa4-M4XXZvTEYA7HPBh-ogTplrFuSISAhDTyyBdR4PO9F3CWQA_KYW_xaWsF49ShpYYMdxw2KrOy8VWncRM73N0-_Ti3lGwWEY1_8RpqazL9lKsyCtJXC8psMKuQ8RosPekuCk',
    stockStatus: 'InStock',
    tag: 'PRECIO AMIGO',
    rating: 4.9,
    reviewCount: 15
  },
  {
    id: 'p10',
    name: 'Kit Señuelos Doradillo',
    description: 'Combinación balanceada de señuelos de media agua ideales para Doradillos, Chafalotes y Tarariras.',
    price: 45000,
    category: 'señuelos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa-yaS3xb7JyeknYgA0-xx8CegHSfPXRi8dk-cQ5dIBScGgMnwmQTA0c-tntAOddCDld2wMJOyWOfb5eO0cpDb5gwfR1Almqc4CRsx6wT-d5KHInslrq1vajCrezvvP5hKUVzBw3TizEdqlFFYgxXcCvk6KCOV6tS7X2uo-hcLWWkCV8euzp2x7YusJLLCJ0zdJ074gRNDN_Nvt9gJGt80sVmRB2upwY0H5AQQLOfNH4fTu9Crz8BTdVxenPtxR6Il8cgO2ablYzI',
    stockStatus: 'InStock',
    rating: 4.6,
    reviewCount: 7
  }
];
