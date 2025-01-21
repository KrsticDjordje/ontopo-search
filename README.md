# Ontopo: Restaurants Search Application

## Tehnologije
- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- Pinia za upravljanje stanjem
- Vue Router za rutiranje
- Axios za HTTP pozive

## Instalacija
1. Klonirajte repozitorijum:
   ```bash
   git clone https://github.com/KrsticDjordje/ontopo-search.git
   cd ontopo-search
   ```
2. Instalirajte zavisnosti:
   ```bash
   npm install
   ```
3. Pokrenite razvojni server:
   ```bash
   npm run dev
   ```

## Struktura projekta
```
src/
├── assets/        # CSS i drugi statički fajlovi
├── components/    # Vue komponente
├── composables/   # Vue composables
├── constants/     # Konstante
├── stores/        # Pinia stores
├── types/         # TypeScript tipovi
├── utils/         # Pomoćne funkcije
└── views/         # Vue stranice
```

## Funkcionalnosti
1. Pretraga restorana po:
   - Broju gostiju
   - Datumu rezervacije
   - Vremenu rezervacije
2. Prikaz rezultata sa:
   - Imenom restorana
   - Opcijama za rezervaciju
3. Infinite scroll za učitavanje dodatnih rezultata
4. Responzivan dizajn
5. Rutiranje sa čuvanjem parametara pretrage

## API Integracija

### 1. Login Anonymously
**Endpoint**: `https://site.ontopo.work/api/loginAnonymously`  
**Metoda**: POST  

### 2. Search Token
**Endpoint**: `https://site.ontopo.work/api/search_token`  
**Metoda**: POST  
**Parametri**:
- criteria (date, time, size)
- marketplace_id
- locale
- geocodes

### 3. Search Request
**Endpoint**: `https://site.ontopo.work/api/search_request`  
**Metoda**: POST  
**Parametri**:
- search_id

## Implementirane funkcionalnosti
- TypeScript za sigurnost tipova
- Rukovanje greškama
- Loading indikatori
- Infinite scroll
- Responzivan dizajn
- State management sa Pinia
- Vue Router za rutiranje
- Komponente optimizovane za ponovno korišćenje

## Pokretanje produkcijske verzije
```bash
npm run build
npm run preview
```
