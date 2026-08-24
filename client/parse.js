const fs = require('fs');

const text = `Sweets:
======
Bellam boondi laddu
250g - 130
500g -  260

Palli pakam/chikki
250g - Rs 130
500g - Rs  260

Raagi dry fruit laddu
250g - Rs 170
500g - Rs  340

Borugula laddu
250g - Rs 80
500g - Rs 160

Kharjoora Nuvvula laddu
250g - Rs 200
500g -  Rs 400

Pottu minapa Sunuundalu
250g -  Rs 180
500g -  Rs  360

Bellam Godhuma Gavvalu
250g -  Rs  140
500g -  Rs  280

Bellam boondi mithai
250g -   Rs130
500g -  Rs  260

Bellam jonna laddu
250g -  Rs 170
500g -  Rs  340

Bellam Ravva kajjikayalu
250g -  Rs125
500g -  Rs 250

Bellam putnala kajjikayalu
250g -  Rs 125
500g - Rs  250

Bellam kobbari kajjikayalu
250g - Rs 140
500g - Rs 280

Pumpkin chikki
250g -Rs 180
500g -Rs 360

Avise karjura laddu
250g -Rs 200
500g -Rs 400

Korra ariselu
250g - Rs130
500g - Rs 260

Bellam ravvaladdu
250g - Rs 130
500g - Rs 260

Palli nuvvula laddu
250g - Rs 150
500g - Rs 300

Bellam sekkar paara
250g - Rs 120
500g - Rs 240

Nuvvula arisslu
250g -Rs 140
500g - Rs  280

Nethi ariselu
250g - Rs170
500g - Rs 340

Bellam mysurpaak
250g - Rs 160
500g - Rs 320

Palli barfi
250g -Rs 130
500g -Rs 260

Khaju barfi
250g- Rs 300
500g- Rs 600

Bellam mamidithandra
250g- Rs 125
500g- Rs 250

Bellam nuvula chikki
250g- Rs 150
500g- Rs 300

Dry fruit laddu
250g- Rs 275
500g- Rs 550

Gondh laddu
 500g- Rs 550
 1000g-Rs 1100

Dry fruit putharekulu
5 piece box - 180

Panasa thonalu 
250 g -Rs130
500 g -Rs 260

Natural honey
1 liter - Rs500

Dry fruit honey
250g - Rs 250
500g - Rs 500

Bellam ragigavallu 
250g - Rs 140
500g - Rs 180

Nuvvula chiki 
250g - RS140
500g - Rs280

Oilgalu
1 piece - Rs20

Jonna pelalu laddu
250g - 150
500g - 300






SNACKS
=======
Palli chekkalu
250g - Rs130
500g - Rs 260

Korra chekkalu
250g - Rs 130
500g - Rs 260

Ragi chekkalu
250g - Rs130
500g - Rs 260

Korra janthikalu
250g - Rs 130
500g - Rs  260

Ragi murukulu
250g - Rs 130
500g - Rs 260

Korra kaaram gavvalu
250g - Rs 130
500g - Rs 260

Arikela kaarapusa
250g - Rs 140
500g - Rs 280

Saama palli murukulu
250g - Rs 140
500g - Rs 280

Pool makhana dry fruit mixture
250g - Rs 500
500g - Rs 1000

Beetroot chekkalu
250g - Rs130
500g -Rs 260

Sajja chekkalu
250g -Rs 130
500g - Rs 260

Kaju masala
250g - Rs 300
500g - Rs 600

Borugula mixture
250g - Rs 120
500g - Rs  240

Cornflakes mixture
250g - Rs 120
500g - Rs 240

Atukula mixture
250g - Rs 120
500g - Rs 240

Boondi kaara
250g -Rs 110
500g -Rs 220

Korra chitti janthikalu
250g -Rs 130
500g -Rs  260

Vaam karalu
250g -Rs 130
500g -Rs 260

Peppar karalu
250g - Rs 130
500g - Rs  260

Chegodilu
250g - Rs 130
500g - Rs 260

Tomoto chips
250g- Rs130
500g- 260

Vamu karalu
250g -Rs130
500g-260

Pepper karalu
250g-130
500g-260

Ragibundi Kara 
250 g - 130
500 g - 260





PICKLES
=======
Kakara pickle
250g -Rs 135
500g -Rs 270

Dried tomato pickle
250g - Rs135
500g - Rs 270

Lemon pachimirchi
250g - Rs 130
500g - Rs 260

Cut mongo
250g - Rs 135
500g - Rs  270

Gongura pickle 
250g - Rs 150
500g - Rs  300

Pandu mirapa
250g - Rs 135
500g - Rs 270

Allam  pickle 
250g -Rs135
500g -Ra 270

Avakaaya pickle 
250g- 135
500g- 270

Sanagala aavakaya
500g- 320
1kg-640

Peasara aavakaya
500g -320
1kg-640

Bellam aavakaya
250g- 135
500g-270

Nuvvula aavakaya
250g-160
500g-320

Nalleru pachadi
250g - 190
500g - 380
1kg - 760

Gongura Pandu Meerapa pachadi
250g 150
500g Rs 300
1kg - Rs 600

Usri thokku pachadi
1kg Rs 540


NON-VEG PICKLE'S 
================
Chitti Royyalu
250g -Rs 500
500g -Rs 1000

Chicken gongura
250g - Rs 285
500g - Rs 570

Bonles chicken
250g - Rs 300
500g - Rs 600

Natukodi pickle(on order)
500g- Rs 1000
1kg- Rs 2000

Mutton pickle(on order)
500g- Rs 1000
1kg - Rs 2000


PODULU
=======
Kakarakaya podi
250g - Rs 225
500g - Rs 450

Avise podi
250g - Rs 225
500g - Rs 450

Vellulli karam
250g - Rs 200
500g - Rs 400

Karivepaku podi
250g - Rs 225
500g - Rs 450

Munagaku podi
250g - Rs 225
500g - Rs 450

Palli podi 
250g - Rs 200
500g - Rs 400

Kobberapodi
250g - Rs 200
500g - Rs 400

Nallakaram podi
250g - Rs 200
500g - Rs 400

Pulihora ready mix podi
250g - Rs 130
500g - Rs  260

Pulihora paste
250g - Rs125
500g - Rs 250

Sambaar podi 
250g - Rs 150
500g - Rs 300

Rasam podi
250g - Rs 150
500g - Rs 300

Garam masala
250g - Rs 250
500g -Rs  500

Karam podi/Red chilli
250g -Rs 125
500g -Rs 250

Dhaniya podi 
250g - Rs 100
500g - Rs 200

Pasupu podi
250g - Rs110
500g - Rs 220

Ragi malt
250g - Rs 130
500g - Rs  260

Chinthaku podi
250g - Rs 225
500g - Rs 450


Nalleru podi
250g - Rs 250
500g - Rs 500


Chitlam podi
250g - Rs 200
500g - Rs 400

VADIYALU
=========
Ragi vadiyalu
250g - Rs 110
500g - Rs 220

Jonna vadiyalu
250g - Rs 110
500g - Rs 220

Biyyam vadiyalu
250g - Rs 100
500g - Rs 200


Gummadi vadiyalu
250g - Rs 170
500g - Rs  340

Majjiga mirapakayalu
250g - Rs 225
500g - Rs 450

oils
----------------
----------------
Coconut oil
1 liter - Rs 560

Kusuma oil
1 liter - Rs 440


Sesame oil
1 liter - Rs 470

Ground nut oil
1 liter - Rs310

Amudhamu
1kg Rs 300


Health organic Powder
----------------------------------------
----------------------------------------
Moringa Powder
250g - Rs 237
500g - Rs 475
1kg - Rs 950

Amala powder
250g - Rs 412
500g - Rs 825
1kg - Rs 1650

Beetroot powder
250g - Rs 412
500g - Rs 825
1kg - Rs 1650`;

const lines = text.split('\n');
let currentCategory = '';
let items = [];
let currentItem = null;

let idCounter = 1;

for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    if (line.match(/^[=-]+$/)) continue; // ignore dividers
    
    if (line === line.toUpperCase() && !line.includes('-') && line.length > 3) {
        currentCategory = line.replace(/[^A-Z ]/g, '').trim();
        continue;
    }

    if (line.toLowerCase() === 'oils' || line.toLowerCase() === 'health organic powder') {
        currentCategory = line.toUpperCase();
        continue;
    }
    
    if (line.includes('-') && /\d/.test(line)) {
        // Price line
        let parts = line.split('-');
        let weight = parts[0].trim();
        let price = parts[1].trim();
        price = price.replace(/[^\d]/g, '');
        if (currentItem) {
            currentItem.variants.push({ weight, price: parseInt(price, 10) });
        }
    } else {
        // New item
        currentItem = {
            id: idCounter++,
            name: line,
            category: currentCategory,
            variants: []
        };
        items.push(currentItem);
    }
}

fs.writeFileSync('items.json', JSON.stringify(items, null, 2));
console.log('Parsed successfully');
