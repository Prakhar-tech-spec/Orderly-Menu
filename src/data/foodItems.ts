export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  halfPrice?: number;
  quarterPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  options?: {
    id: string;
    name: string;
    price: number;
  }[];
  portions?: {
    name: string;
    price: number;
  }[];
}

export const foodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Papad',
    price: 20,
    image: '/images/food-items/PAPAD - DHAMATA.jpeg',
    category: 'Veg',
    subcategory: 'STARTERS VEG',
    description: 'Crispy papad with spices',
  },
  {
    id: '2',
    name: 'Masala Papad',
    price: 50,
    image: '/images/food-items/masala-papad.jpeg',
    category: 'Veg',
    subcategory: 'STARTERS VEG',
    description: 'Spiced papad with masala',
  },
  {
    id: '3',
    name: 'Raja Spl. Chana Chatpata Masala',
    price: 165,
    image: '/images/food-items/chatpata-chana-masala.jpeg',
    category: 'Veg',
    subcategory: 'STARTERS VEG',
    description: 'Spicy chickpeas with special masala',
  },
  {
    id: '4',
    name: 'Paneer Tikka',
    price: 225,
    image: '/images/food-items/paneer-tikka.jpeg',
    category: 'Veg',
    subcategory: 'STARTERS VEG',
    description: 'Grilled cottage cheese with spices',
  },
  {
    id: '5',
    name: 'Chilli Mushroom (Dry)',
    price: 240,
    image: '/images/food-items/dry chilli mushroom.jpeg',
    category: 'Veg',
    subcategory: 'STARTERS VEG',
    description: 'Spicy mushrooms with vegetables',
  },
  {
    id: '6',
    name: 'Paneer Malai Tikka',
    price: 230,
    image: '/images/food-items/paneer malai tikka.jpeg',
    category: 'Veg',
    subcategory: 'STARTERS VEG',
    description: 'Creamy grilled cottage cheese',
  },
  {
    id: '7',
    name: 'Paneer Pakoda',
    price: 240,
    image: '/images/food-items/paneer pakoda.jpeg',
    category: 'Veg',
    subcategory: 'STARTERS VEG',
    description: 'Crispy fried cottage cheese',
  },
  {
    id: '8',
    name: 'Chilli Paneer (Dry)',
    price: 200,
    image: '/images/food-items/dry chilli paneer.jpeg',
    category: 'Veg',
    subcategory: 'STARTERS VEG',
    description: 'Spicy cottage cheese with vegetables',
  },
  {
    id: '9',
    name: 'Chilli Chaap',
    price: 150,
    image: '/images/food-items/chilli chaap.jpeg',
    category: 'Veg',
    subcategory: 'STARTERS VEG',
    description: 'Spicy soy chaap',
  },
  {
    id: '10',
    name: 'Malai Chaap',
    price: 140,
    image: '/images/food-items/malai chaap.jpeg',
    category: 'Veg',
    subcategory: 'STARTERS VEG',
    description: 'Creamy soy chaap',
  },
  {
    id: '11',
    name: 'Achari Chaap',
    price: 140,
    image: '/images/food-items/achari chaap.jpeg',
    category: 'Veg',
    subcategory: 'STARTERS VEG',
    description: 'Pickle-style soy chaap',
  },
  {
    id: '12',
    name: 'Afghani Chaap',
    price: 150,
    image: '/images/food-items/Afghani Chaap.jpeg',
    category: 'Veg',
    subcategory: 'STARTERS VEG',
    description: 'Soy chaap in rich Afghani gravy',
  },
  {
    id: '13',
    name: 'Mix Veg',
    price: 200,
    image: '/images/food-items/mix veg.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Mixed vegetables in rich gravy',
    options: [
      { id: '1', name: 'Full', price: 200 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '14',
    name: 'Veg. Jalfrezi',
    price: 250,
    image: '/images/food-items/veg jalfrezi.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Mixed vegetables in spicy gravy',
  },
  {
    id: '15',
    name: 'Aaloo Dum',
    price: 150,
    image: '/images/food-items/aaloo dum.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Potatoes in spicy gravy',
  },
  {
    id: '16',
    name: 'Aaloo Dum Kashmiri',
    price: 180,
    image: '/images/food-items/aaloo dum kashmiri.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Potatoes in Kashmiri style gravy',
  },
  {
    id: '17',
    name: 'Rajma',
    price: 125,
    image: '/images/food-items/rajma.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Kidney beans curry',
  },
  {
    id: '18',
    name: 'Rajma Masala',
    price: 160,
    image: '/images/food-items/rajma masala.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Spiced kidney beans curry',
  },
  {
    id: '19',
    name: 'Chana Masala',
    price: 150,
    image: '/images/food-items/chana masala.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Spiced chickpeas curry',
  },
  {
    id: '20',
    name: 'Chole',
    price: 115,
    image: '/images/food-items/chole.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Traditional chickpeas curry',
  },
  {
    id: '21',
    name: 'Dal Makhni',
    price: 200,
    image: '/images/food-items/dal makhani.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Creamy black lentils curry',
    options: [
      { id: '1', name: 'Full', price: 200 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '22',
    name: 'Dal Ghee Wali (Urad Rajma)',
    price: 250,
    image: '/images/food-items/dal ghee wali ( urad rajma ).jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Black lentils and kidney beans in ghee',
  },
  {
    id: '23',
    name: 'Dal Ghee Wali (Arhar)',
    price: 170,
    image: '/images/food-items/dal ghee wali ( arhar ).jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Pigeon peas in ghee',
  },
  {
    id: '24',
    name: 'Dal Butter Fry (Yellow Dal)',
    price: 140,
    image: '/images/food-items/dal butter fry ( yellow dal ).jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Butter-fried yellow lentils',
  },
  {
    id: '25',
    name: 'Dal Fry (Yellow Dal)',
    price: 99,
    image: '/images/food-items/dal fry ( yellow dal ).jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Fried yellow lentils',
  },
  {
    id: '26',
    name: 'Dal Tadka',
    price: 120,
    image: '/images/food-items/dal tadka.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Yellow dal tadka in whole red chilli & coriander seeds',
  },
  {
    id: '27',
    name: 'Kaju Curry',
    price: 250,
    image: '/images/food-items/kaju curry.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Cashew curry in rich gravy',
  },
  {
    id: '28',
    name: 'Malai Kofta',
    price: 190,
    image: '/images/food-items/malai kofta.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Creamy vegetable dumplings in rich gravy',
  },
  {
    id: '29',
    name: 'Aaloo Matar',
    price: 100,
    image: '/images/food-items/aaloo matar.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Potatoes and peas curry',
  },
  {
    id: '30',
    name: 'Aaloo Tamatar',
    price: 120,
    image: '/images/food-items/aaloo tamatar.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Potatoes in tomato gravy',
  },
  {
    id: '31',
    name: 'Kadhi Pakoda',
    price: 99,
    image: '/images/food-items/kadhi pakoda.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Yogurt curry with vegetable fritters',
  },
  {
    id: '32',
    name: 'Kadhi Butter Fry',
    price: 120,
    image: '/images/food-items/kadhi butter fry.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Butter-fried yogurt curry',
  },
  {
    id: '33',
    name: 'Aaloo Jeera',
    price: 99,
    image: '/images/food-items/aaloo jeera.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Potatoes with cumin seeds',
  },
  {
    id: '34',
    name: 'Aaloo Palak',
    price: 110,
    image: '/images/food-items/aaloo palak.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Potatoes with spinach',
  },
  {
    id: '35',
    name: 'Aaloo Gobhi',
    price: 99,
    image: '/images/food-items/aaloo gobhi.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Potatoes with cauliflower',
  },
  {
    id: '36',
    name: 'Aaloo Gobhi Masala',
    price: 140,
    image: '/images/food-items/aaloo gobhi masala.jpeg',
    category: 'Veg',
    subcategory: 'MAIN COURSE VEG',
    description: 'Spiced potatoes with cauliflower'
  },
  {
    id: '39',
    name: 'Hakka Noodles',
    price: 249,
    image: '/images/food-items/hakka noodles.jpeg',
    category: 'Chinese',
    description: 'Stir-fried noodles with vegetables'
  },
  {
    id: '40',
    name: 'Butter Naan',
    price: 99,
    image: '/images/food-items/butter naan.jpeg',
    category: 'Chapatiyan',
    description: 'Buttery Indian flatbread',
  },
  {
    id: '41',
    name: 'Gulab Jamun',
    price: 149,
    image: '/images/food-items/gulab jamun.jpeg',
    category: 'Desserts',
    description: 'Sweet milk dumplings in sugar syrup',
  },
  {
    id: '42',
    name: 'Green Salad',
    price: 179,
    image: '/images/food-items/green salad.jpeg',
    category: 'Salad',
    description: 'Fresh mixed greens with dressing',
  },
  {
    id: '43',
    name: 'Veg Thali',
    price: 399,
    image: '/images/food-items/veg thali.jpeg',
    category: 'Thali',
    description: 'Complete meal with variety of dishes',
  },
  {
    id: '44',
    name: 'Tawa Paneer',
    price: 250,
    image: '/images/food-items/tawa paneer.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Paneer cooked on tawa with special spices',
  },
  {
    id: '45',
    name: 'Shahi Mawa Paneer',
    price: 250,
    image: '/images/food-items/shahi mawa paneer.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Rich and creamy paneer with mawa',
  },
  {
    id: '46',
    name: 'Khoya Paneer',
    price: 250,
    image: '/images/food-items/khoya paneer.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Paneer cooked with khoya in rich gravy',
  },
  {
    id: '47',
    name: 'Paneer Takatak',
    price: 250,
    image: '/images/food-items/paneer takatak.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Spicy and tangy paneer preparation',
  },
  {
    id: '48',
    name: 'Kadhai Paneer',
    price: 230,
    image: '/images/food-items/kadai paneer.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Paneer cooked in kadhai style with capsicum and onions',
    options: [
      { id: '1', name: 'Full', price: 230 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '49',
    name: 'Paneer Methi Malai',
    price: 250,
    image: '/images/food-items/paneer methi malai.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Creamy paneer with fenugreek leaves',
    options: [
      { id: '1', name: 'Full', price: 250 },
      { id: '2', name: 'Half', price: 135 }
    ]
  },
  {
    id: '50',
    name: 'Paneer Lababdaar',
    price: 225,
    image: '/images/food-items/paneer lababdaar.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Rich and creamy paneer curry',
    options: [
      { id: '1', name: 'Full', price: 225 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '51',
    name: 'Paneer Toofani',
    price: 225,
    image: '/images/food-items/paneer toofani.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Spicy and tangy paneer preparation',
    options: [
      { id: '1', name: 'Full', price: 225 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '52',
    name: 'Paneer Reshmi',
    price: 230,
    image: '/images/food-items/paneer reshmi.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Silky smooth paneer in rich gravy',
    options: [
      { id: '1', name: 'Full', price: 230 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '53',
    name: 'Paneer Haandi',
    price: 225,
    image: '/images/food-items/paneer haandi.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Paneer cooked in traditional haandi style',
    options: [
      { id: '1', name: 'Full', price: 225 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '54',
    name: 'Chilli Paneer (Curry)',
    price: 225,
    image: '/images/food-items/chilli paneer ( curry .jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Spicy paneer in curry gravy',
    options: [
      { id: '1', name: 'Full', price: 225 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '55',
    name: 'Shahi Paneer',
    price: 220,
    image: '/images/food-items/shahi paneer.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Royal style paneer in rich gravy',
    options: [
      { id: '1', name: 'Full', price: 220 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '56',
    name: 'Matar Paneer',
    price: 210,
    image: '/images/food-items/matar paneer.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Paneer with green peas in rich gravy',
    options: [
      { id: '1', name: 'Full', price: 210 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '57',
    name: 'Palak Paneer',
    price: 150,
    image: '/images/food-items/palak paneer.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Paneer in creamy spinach gravy',
    options: [
      { id: '1', name: 'Half', price: 150 }
    ]
  },
  {
    id: '58',
    name: 'Paneer Bhujiya',
    price: 250,
    image: '/images/food-items/paneer bhujiya.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Crispy paneer with vegetables',
    options: [
      { id: '1', name: 'Full', price: 250 },
      { id: '2', name: 'Half', price: 150 }
    ]
  },
  {
    id: '59',
    name: 'Paneer Butter Masala',
    price: 225,
    image: '/images/food-items/paneer butter masala.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Paneer in rich butter tomato gravy',
    options: [
      { id: '1', name: 'Full', price: 225 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '60',
    name: 'Paneer Korma',
    price: 250,
    image: '/images/food-items/paneer korma .jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Rich and creamy paneer korma',
    options: [
      { id: '1', name: 'Full', price: 250 },
      { id: '2', name: 'Half', price: 150 }
    ]
  },
  {
    id: '61',
    name: 'Paneer Do Piyaza',
    price: 225,
    image: '/images/food-items/paneer do piyaza.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Paneer with double onion preparation',
    options: [
      { id: '1', name: 'Full', price: 225 },
      { id: '2', name: 'Half', price: 135 }
    ]
  },
  {
    id: '62',
    name: 'Paneer Pasanda',
    price: 250,
    image: '/images/food-items/paneer pasanda.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Stuffed paneer in rich gravy',
  },
  {
    id: '63',
    name: 'Paneer Tikka Masala',
    price: 250,
    image: '/images/food-items/paneer tikka masala.jpeg',
    category: 'Paneer ka Jayaka',
    description: 'Grilled paneer in rich masala gravy',
  },
  {
    id: '64',
    name: 'Mushroom Curry',
    price: 180,
    image: '/images/food-items/mushroom%20curry.jpeg',
    category: 'Mushroom / Chaap',
    description: 'Mushroom cooked in rich curry gravy',
    options: [
      { id: '1', name: 'Full', price: 225 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '65',
    name: 'Kadhai Mushroom',
    price: 200,
    image: '/images/food-items/kadhai%20mushroom.jpeg',
    category: 'Mushroom / Chaap',
    description: 'Mushroom cooked in kadhai style gravy',
    options: [
      { id: '1', name: 'Full', price: 225 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '66',
    name: 'Matar Mushroom',
    price: 180,
    image: '/images/food-items/matar%20mushroom.jpeg',
    category: 'Mushroom / Chaap',
    description: 'Mushroom cooked with green peas',
    options: [
      { id: '1', name: 'Full', price: 225 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '67',
    name: 'Mushroom Do Piyaza',
    price: 180,
    image: '/images/food-items/mushroom%20do%20piyaza.jpeg',
    category: 'Mushroom / Chaap',
    description: 'Mushroom cooked with onions in special gravy',
    options: [
      { id: '1', name: 'Full', price: 225 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '68',
    name: 'Chilli Mushroom',
    price: 200,
    image: '/images/food-items/chilli%20mushroom.jpeg',
    category: 'Mushroom / Chaap',
    description: 'Mushroom cooked in spicy chilli sauce',
    options: [
      { id: '1', name: 'Full', price: 225 },
      { id: '2', name: 'Half', price: 130 }
    ]
  },
  {
    id: '69',
    name: 'Soya Chaap Curry',
    price: 180,
    image: '/images/food-items/soya%20chaap%20curry.jpeg',
    category: 'Mushroom / Chaap',
    description: 'Soya chaap cooked in rich curry gravy',
    options: [
      { id: '1', name: 'Half', price: 130 }
    ]
  },
  {
    id: '70',
    name: 'Kadhai Chaap Curry',
    price: 200,
    image: '/images/food-items/kadhai%20chaap%20curry.jpeg',
    category: 'Mushroom / Chaap',
    description: 'Soya chaap cooked in kadhai style gravy',
    options: [
      { id: '1', name: 'Half', price: 150 }
    ]
  },
  {
    id: '71',
    name: 'Chaap Do Piyaza',
    price: 180,
    image: '/images/food-items/chaap%20do%20piyaza.jpeg',
    category: 'Mushroom / Chaap',
    description: 'Soya chaap cooked with onions in special gravy',
    options: [
      { id: '1', name: 'Half', price: 150 }
    ]
  },
  {
    id: '72',
    name: 'Chaap Tawa Masala',
    price: 200,
    image: '/images/food-items/chaap%20tawa%20masala.jpeg',
    category: 'Mushroom / Chaap',
    description: 'Soya chaap cooked in tawa masala style',
    options: [
      { id: '1', name: 'Half', price: 150 }
    ]
  },
  {
    id: '73',
    name: 'Egg Curry',
    price: 110,
    image: '/images/food-items/egg curry.jpeg',
    category: 'Ande ka Funda',
    description: 'Eggs cooked in rich curry gravy (2 eggs)',
    options: [
      { id: '1', name: 'Additional Egg', price: 35 }
    ]
  },
  {
    id: '74',
    name: 'Egg Bhujiya',
    price: 80,
    image: '/images/food-items/egg bhujiya.jpeg',
    category: 'Ande ka Funda',
    description: 'Scrambled eggs with spices (2 eggs)'
  },
  {
    id: '75',
    name: 'Egg Keema',
    price: 120,
    image: '/images/food-items/egg keema.jpeg',
    category: 'Ande ka Funda',
    description: 'Minced eggs cooked with spices (2 eggs)'
  },
  {
    id: '76',
    name: 'Butter Chicken (Restro Style)',
    price: 520,
    image: '/images/food-items/butter chicken ( restro style ).jpeg',
    category: 'Non Veg',
    subcategory: 'REGULAR CHICKEN',
    description: 'Classic butter chicken in restaurant style gravy',
    options: [
      { id: '1', name: 'Half (6 pcs)', price: 290 },
      { id: '2', name: 'Quarter (3 pcs)', price: 175 }
    ]
  },
  {
    id: '77',
    name: 'Butter Chicken (Dhaba Style)',
    price: 520,
    image: '/images/food-items/butter chicken ( dhaba style ).jpeg',
    category: 'Non Veg',
    subcategory: 'REGULAR CHICKEN',
    description: 'Authentic dhaba style butter chicken',
    options: [
      { id: '1', name: 'Half (6 pcs)', price: 290 },
      { id: '2', name: 'Quarter (3 pcs)', price: 175 }
    ]
  },
  {
    id: '78',
    name: 'Haandi Chicken',
    price: 520,
    image: '/images/food-items/haandi chicken.jpeg',
    category: 'Non Veg',
    subcategory: 'REGULAR CHICKEN',
    description: 'Chicken cooked in traditional haandi style',
    options: [
      { id: '1', name: 'Half (6 pcs)', price: 290 },
      { id: '2', name: 'Quarter (3 pcs)', price: 175 }
    ]
  },
  {
    id: '79',
    name: 'Chicken Korma',
    price: 520,
    image: '/images/food-items/chicken korma.jpeg',
    category: 'Non Veg',
    subcategory: 'REGULAR CHICKEN',
    description: 'Rich and creamy chicken korma curry',
    options: [
      { id: '1', name: 'Half (6 pcs)', price: 290 },
      { id: '2', name: 'Quarter (3 pcs)', price: 175 }
    ]
  },
  {
    id: '80',
    name: 'Chicken Curry',
    price: 520,
    image: '/images/food-items/chicken curry.jpeg',
    category: 'Non Veg',
    subcategory: 'REGULAR CHICKEN',
    description: 'Classic chicken curry with aromatic spices',
    options: [
      { id: '1', name: 'Half (6 pcs)', price: 290 },
      { id: '2', name: 'Quarter (3 pcs)', price: 175 }
    ]
  },
  {
    id: '81',
    name: 'Chicken Do Piyaza',
    price: 520,
    image: '/images/food-items/chicken do piyaza.jpeg',
    category: 'Non Veg',
    subcategory: 'REGULAR CHICKEN',
    description: 'Chicken cooked with onions in special gravy',
    options: [
      { id: '1', name: 'Half (6 pcs)', price: 290 },
      { id: '2', name: 'Quarter (3 pcs)', price: 175 }
    ]
  },
  {
    id: '82',
    name: 'Kadhai Chicken',
    price: 520,
    image: '/images/food-items/kadhai chicken.jpeg',
    category: 'Non Veg',
    subcategory: 'REGULAR CHICKEN',
    description: 'Chicken cooked in traditional kadhai style',
    options: [
      { id: '1', name: 'Half (6 pcs)', price: 290 },
      { id: '2', name: 'Quarter (3 pcs)', price: 175 }
    ]
  },
  {
    id: '83',
    name: 'Chicken Masala',
    price: 530,
    image: '/images/food-items/chicken masala.jpeg',
    category: 'Non Veg',
    subcategory: 'REGULAR CHICKEN',
    description: 'Spicy chicken masala curry',
    options: [
      { id: '1', name: 'Half (6 pcs)', price: 300 },
      { id: '2', name: 'Quarter (3 pcs)', price: 185 }
    ]
  },
  {
    id: '84',
    name: 'Chilli Chicken',
    price: 520,
    image: '/images/food-items/chilli chicken.jpeg',
    category: 'Non Veg',
    subcategory: 'REGULAR CHICKEN',
    description: 'Spicy chilli chicken in gravy',
    options: [
      { id: '1', name: 'Half (6 pcs)', price: 290 },
      { id: '2', name: 'Quarter (3 pcs)', price: 175 }
    ]
  },
  {
    id: '85',
    name: 'Any Regular Chicken Dish with Boneless Pieces',
    price: 565,
    image: '/images/food-items/any regular chicken dish with boneless pieces.jpeg',
    category: 'Non Veg',
    subcategory: 'REGULAR CHICKEN',
    description: 'Choice of any regular chicken dish with boneless pieces',
    options: [
      { id: '1', name: 'Half (6 pcs)', price: 340 },
      { id: '2', name: 'Quarter (3 pcs)', price: 220 }
    ]
  },
  {
    id: '86',
    name: 'Chicken Lollipop',
    price: 530,
    image: '/images/food-items/chicken lollipop.jpeg',
    category: 'Non Veg',
    subcategory: 'NON VEG STARTERS',
    description: 'Crispy chicken lollipops with special spices',
    options: [
      { id: '1', name: 'Full (10 pcs)', price: 530 },
      { id: '2', name: 'Half (5 pcs)', price: 265 },
      { id: '3', name: 'Quarter (3 pcs)', price: 165 }
    ]
  },
  {
    id: '87',
    name: 'Chicken Tikka',
    price: 400,
    image: '/images/food-items/chicken tikka.jpeg',
    category: 'Non Veg',
    subcategory: 'NON VEG STARTERS',
    description: 'Grilled chicken tikka with spices',
    options: [
      { id: '1', name: 'Full (10 pcs)', price: 400 },
      { id: '2', name: 'Half (5 pcs)', price: 240 }
    ]
  },
  {
    id: '88',
    name: 'Chicken Malai Tikka',
    price: 420,
    image: '/images/food-items/chicken malai tikka.jpeg',
    category: 'Non Veg',
    subcategory: 'NON VEG STARTERS',
    description: 'Creamy grilled chicken tikka',
    options: [
      { id: '1', name: 'Full (10 pcs)', price: 420 },
      { id: '2', name: 'Half (5 pcs)', price: 250 }
    ]
  },
  {
    id: '89',
    name: 'Chicken Biryani (Masala Fried)',
    price: 150,
    image: '/images/food-items/chicken biryani ( masala fried ).jpeg',
    category: 'Non Veg',
    subcategory: 'NON VEG STARTERS',
    description: 'Spicy fried chicken biryani',
    options: [
      { id: '1', name: 'Full (5 pcs)', price: 150 },
      { id: '2', name: 'Half (3 pcs)', price: 100 }
    ]
  },
  {
    id: '90',
    name: 'Chicken Dum Biryani',
    price: 145,
    image: '/images/food-items/chicken dum biryani.jpeg',
    category: 'Non Veg',
    subcategory: 'NON VEG STARTERS',
    description: 'Aromatic chicken dum biryani',
    options: [
      { id: '1', name: 'Full (5 pcs)', price: 145 },
      { id: '2', name: 'Half (3 pcs)', price: 95 }
    ]
  },
  {
    id: '91',
    name: 'Chicken Fried Rice',
    price: 175,
    image: '/images/food-items/chicken fried rice.jpeg',
    category: 'Non Veg',
    subcategory: 'NON VEG STARTERS',
    description: 'Flavorful chicken fried rice'
  },
  {
    id: '92',
    name: 'Chic. Mughlai Biryani',
    price: 175,
    image: '/images/food-items/chic. mughlai biryani.jpeg',
    category: 'Non Veg',
    subcategory: 'NON VEG STARTERS',
    description: 'Rich Mughlai style chicken biryani',
    options: [
      { id: '1', name: 'Full (5 pcs)', price: 175 },
      { id: '2', name: 'Half (3 pcs)', price: 110 }
    ]
  },
  {
    id: '93',
    name: 'Chilli Chicken (Dry)',
    price: 480,
    image: '/images/food-items/chilli chicken ( dry ).jpeg',
    category: 'Non Veg',
    subcategory: 'NON VEG STARTERS',
    description: 'Spicy dry chilli chicken',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 480 },
      { id: '2', name: 'Half (6 pcs)', price: 270 },
      { id: '3', name: 'Quarter (3 pcs)', price: 170 }
    ]
  },
  {
    id: '94',
    name: 'Chicken Pakoda',
    price: 420,
    image: '/images/food-items/chicken pakoda.jpeg',
    category: 'Non Veg',
    subcategory: 'NON VEG STARTERS',
    description: 'Crispy chicken pakoras',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 420 },
      { id: '2', name: 'Half (6 pcs)', price: 240 }
    ]
  },
  {
    id: '95',
    name: 'Fry Chicken',
    price: 400,
    image: '/images/food-items/fry chicken.jpeg',
    category: 'Non Veg',
    subcategory: 'NON VEG STARTERS',
    description: 'Crispy fried chicken',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 400 },
      { id: '2', name: 'Half (6 pcs)', price: 240 }
    ]
  },
  {
    id: '96',
    name: 'Tandoori Chicken',
    price: 380,
    image: '/images/food-items/tandoori chicken.jpeg',
    category: 'Non Veg',
    subcategory: 'NON VEG STARTERS',
    description: 'Classic tandoori chicken',
    options: [
      { id: '1', name: 'Full (8 pcs)', price: 380 },
      { id: '2', name: 'Half (4 pcs)', price: 220 },
      { id: '3', name: 'Quarter (2 pcs)', price: 110 }
    ]
  },
  {
    id: '97',
    name: 'Afghani Chicken',
    price: 400,
    image: '/images/food-items/afghani chicken.jpeg',
    category: 'Non Veg',
    subcategory: 'NON VEG STARTERS',
    description: 'Afghani style grilled chicken',
    options: [
      { id: '1', name: 'Full (8 pcs)', price: 400 },
      { id: '2', name: 'Half (4 pcs)', price: 230 }
    ]
  },
  {
    id: '98',
    name: 'Mutton Biryani',
    price: 350,
    image: '/images/food-items/mutton biryani.jpeg',
    category: 'Non Veg',
    subcategory: 'NON VEG STARTERS',
    description: 'Aromatic mutton biryani',
    options: [
      { id: '1', name: 'Full (4 pcs)', price: 350 },
      { id: '2', name: 'Half (2 pcs)', price: 200 }
    ]
  },
  {
    id: '99',
    name: 'Mutton Mughlai Biryani',
    price: 360,
    image: '/images/food-items/mutton mughlai biryani.jpeg',
    category: 'Non Veg',
    subcategory: 'NON VEG STARTERS',
    description: 'Rich Mughlai style mutton biryani',
    options: [
      { id: '1', name: 'Full (4 pcs)', price: 360 },
      { id: '2', name: 'Half (2 pcs)', price: 210 }
    ]
  },
  {
    id: '100',
    name: 'Chicken Saag Wala',
    price: 550,
    image: '/images/food-items/chicken saag wala.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'Chicken cooked with spinach in rich gravy',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 550 },
      { id: '2', name: 'Half (6 pcs)', price: 350 },
      { id: '3', name: 'Quarter (3 pcs)', price: 200 }
    ]
  },
  {
    id: '101',
    name: 'Chicken Raja Wala',
    price: 550,
    image: '/images/food-items/chicken raja wala.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'Royal style chicken preparation',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 550 },
      { id: '2', name: 'Half (6 pcs)', price: 350 },
      { id: '3', name: 'Quarter (3 pcs)', price: 200 }
    ]
  },
  {
    id: '102',
    name: 'Chicken Home Style',
    price: 550,
    image: '/images/food-items/chicken home style.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'Homestyle chicken curry',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 550 },
      { id: '2', name: 'Half (6 pcs)', price: 350 },
      { id: '3', name: 'Quarter (3 pcs)', price: 200 }
    ]
  },
  {
    id: '103',
    name: 'Tawa Chicken',
    price: 535,
    image: '/images/food-items/tawa chicken .jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'Chicken cooked on tawa with special spices',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 535 },
      { id: '2', name: 'Half (6 pcs)', price: 310 },
      { id: '3', name: 'Quarter (3 pcs)', price: 200 }
    ]
  },
  {
    id: '104',
    name: 'Chicken Kali Mirch',
    price: 535,
    image: '/images/food-items/chicken kali mirch.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'Chicken with black pepper',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 535 },
      { id: '2', name: 'Half (6 pcs)', price: 310 }
    ]
  },
  {
    id: '105',
    name: 'Chicken Lababdaar',
    price: 535,
    image: '/images/food-items/chicken lababdaar.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'Rich and creamy chicken curry',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 535 },
      { id: '2', name: 'Half (6 pcs)', price: 310 },
      { id: '3', name: 'Quarter (3 pcs)', price: 200 }
    ]
  },
  {
    id: '106',
    name: 'Chicken Raara',
    price: 550,
    image: '/images/food-items/chicken raara.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'Spicy chicken preparation',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 550 },
      { id: '2', name: 'Half (6 pcs)', price: 320 }
    ]
  },
  {
    id: '107',
    name: 'Chicken Lollipop (Curry)',
    price: 550,
    image: '/images/food-items/chicken lollipop ( curry ).jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'Chicken lollipops in curry gravy',
    options: [
      { id: '1', name: 'Full (10 pcs)', price: 550 },
      { id: '2', name: 'Half (5 pcs)', price: 310 },
      { id: '3', name: 'Quarter (3 pcs)', price: 210 }
    ]
  },
  {
    id: '108',
    name: 'Chicken Tikka Masala',
    price: 550,
    image: '/images/food-items/chciken tikka masala.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'Grilled chicken tikka in rich masala gravy',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 550 },
      { id: '2', name: 'Half (6 pcs)', price: 340 }
    ]
  },
  {
    id: '109',
    name: 'Chicken Changezi',
    price: 535,
    image: '/images/food-items/chicken changezi.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'Mughlai style chicken preparation',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 535 },
      { id: '2', name: 'Half (6 pcs)', price: 310 },
      { id: '3', name: 'Quarter (3 pcs)', price: 200 }
    ]
  },
  {
    id: '110',
    name: 'Afghani Chicken (Curry)',
    price: 550,
    image: '/images/food-items/afghani chicken ( curry ).jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'Afghani style chicken curry',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 550 },
      { id: '2', name: 'Half (6 pcs)', price: 310 }
    ]
  },
  {
    id: '111',
    name: 'Kaju Chicken',
    price: 550,
    image: '/images/food-items/kaju chicken.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'Chicken with cashews in rich gravy',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 550 },
      { id: '2', name: 'Half (6 pcs)', price: 310 }
    ]
  },
  {
    id: '112',
    name: 'Cream Chicken',
    price: 550,
    image: '/images/food-items/cream chicken.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'White curry chicken with a sweetened flavour',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 550 },
      { id: '2', name: 'Half (6 pcs)', price: 310 }
    ]
  },
  {
    id: '113',
    name: 'Lemon Chicken',
    price: 535,
    image: '/images/food-items/lemon chicken.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'Tangy lemon flavored chicken',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 535 },
      { id: '2', name: 'Half (6 pcs)', price: 310 }
    ]
  },
  {
    id: '114',
    name: 'Mughlai Chicken',
    price: 535,
    image: '/images/food-items/mughlai chicken.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'Rich Mughlai style chicken preparation',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 535 },
      { id: '2', name: 'Half (6 pcs)', price: 310 },
      { id: '3', name: 'Quarter (3 pcs)', price: 200 }
    ]
  },
  {
    id: '115',
    name: 'Any Special Chicken Dish with Boneless Pieces',
    price: 600,
    image: '/images/food-items/any special chicken dish with boneless pieces.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'CHICKEN MAIN COURSE',
    description: 'Special chicken preparation with boneless pieces',
    options: [
      { id: '1', name: 'Full (12 pcs)', price: 600 },
      { id: '2', name: 'Half (6 pcs)', price: 350 },
      { id: '3', name: 'Quarter (3 pcs)', price: 230 }
    ]
  },
  {
    id: '76',
    name: 'Mutton Raja Wala',
    price: 450,
    image: '/images/food-items/mutton raja wala.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'MUTTON MAIN COURSE',
    description: 'Royal style mutton curry with rich spices',
    options: [
      { id: '1', name: 'Half (2 pcs)', price: 250 }
    ]
  },
  {
    id: '77',
    name: 'Mutton Rogan Josh',
    price: 425,
    image: '/images/food-items/mutton rogan josh.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'MUTTON MAIN COURSE',
    description: 'Classic Kashmiri style mutton curry',
    options: [
      { id: '1', name: 'Half (2 pcs)', price: 230 }
    ]
  },
  {
    id: '78',
    name: 'Saag Mutton',
    price: 424,
    image: '/images/food-items/saag mutton.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'MUTTON MAIN COURSE',
    description: 'Mutton cooked with spinach and spices',
    options: [
      { id: '1', name: 'Half (2 pcs)', price: 230 }
    ]
  },
  {
    id: '79',
    name: 'Mutton Korma',
    price: 425,
    image: '/images/food-items/mutton korma.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'MUTTON MAIN COURSE',
    description: 'Mutton in rich, creamy gravy',
    options: [
      { id: '1', name: 'Half (2 pcs)', price: 230 }
    ]
  },
  {
    id: '80',
    name: 'Meet Masala',
    price: 425,
    image: '/images/food-items/meet masala.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'MUTTON MAIN COURSE',
    description: 'Spicy mutton masala curry',
    options: [
      { id: '1', name: 'Half (2 pcs)', price: 230 }
    ]
  },
  {
    id: '81',
    name: 'Kadhai Mutton',
    price: 425,
    image: '/images/food-items/kadhai mutton.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'MUTTON MAIN COURSE',
    description: 'Mutton cooked in kadhai style with bell peppers',
    options: [
      { id: '1', name: 'Half (2 pcs)', price: 230 }
    ]
  },
  {
    id: '82',
    name: 'Mutton Curry',
    price: 425,
    image: '/images/food-items/mutton curry.jpeg',
    category: 'Chicken / Mutton Main Course',
    subcategory: 'MUTTON MAIN COURSE',
    description: 'Classic mutton curry with aromatic spices',
    options: [
      { id: '1', name: 'Half (2 pcs)', price: 230 }
    ]
  }
];

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  bg: string;
}

export const categories: Category[] = [
  { 
    id: '1', 
    name: 'Veg', 
    icon: '🥬',
    image: '/images/categories/veg.jpg',
    bg: '#E3FFE6'
  },
  { 
    id: '2', 
    name: 'Non Veg', 
    icon: '🍗',
    image: '/images/categories/non-veg.jpg',
    bg: '#FFE8E0'
  },
  { 
    id: '9', 
    name: 'Chicken / Mutton Main Course', 
    icon: '🍖',
    image: '/images/categories/chicken-mutton.jpg',
    bg: '#FFE8E0'
  },
  { 
    id: '3', 
    name: 'Ande ka Funda', 
    icon: '🥚',
    image: '/images/categories/egg.jpg',
    bg: '#FFF8E0'
  },
  { 
    id: '4', 
    name: 'Chinese', 
    icon: '🥡',
    image: '/images/categories/chinese.jpg',
    bg: '#E6F7FF'
  },
  { 
    id: '5', 
    name: 'Chapatiyan', 
    icon: '🫓',
    image: '/images/categories/chapati.jpg',
    bg: '#FFE6F5'
  },
  { 
    id: '6', 
    name: 'Desserts', 
    icon: '🍰',
    image: '/images/categories/dessert.jpg',
    bg: '#F0E6FF'
  },
  { 
    id: '7', 
    name: 'Salad', 
    icon: '🥗',
    image: '/images/categories/salad.jpg',
    bg: '#E3FFE6'
  },
  { 
    id: '8', 
    name: 'Thali', 
    icon: '🍱',
    image: '/images/categories/thali.jpg',
    bg: '#FFE8E0'
  }
];

// Categories for home page (excluding Chicken / Mutton Main Course)
export const homePageCategories: Category[] = [
  { 
    id: '1', 
    name: 'Veg', 
    icon: '🥬',
    image: '/images/categories/veg.jpg',
    bg: '#E3FFE6'
  },
  { 
    id: '2', 
    name: 'Non Veg', 
    icon: '🍗',
    image: '/images/categories/non-veg.jpg',
    bg: '#FFE8E0'
  },
  { 
    id: '3', 
    name: 'Ande ka Funda', 
    icon: '🥚',
    image: '/images/categories/egg.jpg',
    bg: '#FFF8E0'
  },
  { 
    id: '4', 
    name: 'Chinese', 
    icon: '🥡',
    image: '/images/categories/chinese.jpg',
    bg: '#E6F7FF'
  },
  { 
    id: '5', 
    name: 'Chapatiyan', 
    icon: '🫓',
    image: '/images/categories/chapati.jpg',
    bg: '#FFE6F5'
  },
  { 
    id: '6', 
    name: 'Desserts', 
    icon: '🍰',
    image: '/images/categories/dessert.jpg',
    bg: '#F0E6FF'
  },
  { 
    id: '7', 
    name: 'Salad', 
    icon: '🥗',
    image: '/images/categories/salad.jpg',
    bg: '#E3FFE6'
  },
  { 
    id: '8', 
    name: 'Thali', 
    icon: '🍱',
    image: '/images/categories/thali.jpg',
    bg: '#FFE8E0'
  }
]; 