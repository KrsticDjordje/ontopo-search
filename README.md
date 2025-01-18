# Ontopo: Restaurants Search Application

## Tehnologije
- Vue 3
- Pinia za upravljanje stanjem
- Vue Router za rutiranje
- Axios za HTTP pozive

## Instalacija
1. Klonirajte repozitorijum:
   ```bash
   git clone <repo-url>
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

## API Integracija
### 1. Login Anonymously
**Endpoint**: `https://site.ontopo.work/api/loginAnonymously`  
**Metoda**: POST  
**Body**: `null`  

**Odgovor**:
```json
{
  "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYW5vbnltb3VzIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFub255bW91cyIsIngtaGFzdXJhLXVzZXItaWQiOiJlMmMzYzBmNi02ZWQ0LTRhMTItYTM3Yi0wZmFlYzMyNDYwMjEifSwiaWF0IjoxNzM3MTkwMTM5LCJleHAiOjE3MzcxOTEwMzl9.bSr16FZNO1IySiBGGRyTpwaqL2Dm7lYtwDUM3LoRytU",
  "refresh_token": "bd2abc37-6c18-44e2-b10f-dca0297a1df3"
}
```
Koristite `jwt_token` u narednim API pozivima.

### 2. Search Token
**Endpoint**: `https://site.ontopo.work/api/search_token`  
**Headers**:
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYW5vbnltb3VzIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFub255bW91cyIsIngtaGFzdXJhLXVzZXItaWQiOiJlMmMzYzBmNi02ZWQ0LTRhMTItYTM3Yi0wZmFlYzMyNDYwMjEifSwiaWF0IjoxNzM3MTkwMTM5LCJleHAiOjE3MzcxOTEwMzl9.bSr16FZNO1IySiBGGRyTpwaqL2Dm7lYtwDUM3LoRytU"
}
```
**Body**:
```json
{
  "criteria": {
    "date": "20240813",
    "time": "1900",
    "size": "2"
  },
  "marketplace_id": "15380287",
  "locale": "en",
  "geocodes": ["belgrade"]
}
```
**Odgovor**:
```json
{
  "search_id": "SkZEy2Wfo_"
}
```

### 3. Search Request
**Endpoint**: `https://site.ontopo.work/api/search_request`  
**Headers**:
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYW5vbnltb3VzIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFub255bW91cyIsIngtaGFzdXJhLXVzZXItaWQiOiJlMmMzYzBmNi02ZWQ0LTRhMTItYTM3Yi0wZmFlYzMyNDYwMjEifSwiaWF0IjoxNzM3MTkwMTM5LCJleHAiOjE3MzcxOTEwMzl9.bSr16FZNO1IySiBGGRyTpwaqL2Dm7lYtwDUM3LoRytU"
}
```
**Body**:
```json
{
  "search_id": "SkZEy2Wfo_"
}
```
**Odgovor**:
```json
{
  "posts": [
    {
      "post": {
        "venue_name": "SavaSava Concept",
        "availability_search": 0.501
      }
    }
  ],
  "total": 100
}
```
Ako je `total` veći od dužine `posts` niza, implementirajte "Load More" funkcionalnost.

## Funkcionalnosti
1. Kreirajte formu za pretragu sa sledećim poljima:
   - Broj gostiju (Size)
   - Datum rezervacije (Date)
   - Vreme rezervacije (Time)

2. Prikaz rezultata pretrage:
   - Ime restorana
   - Opcije za rezervaciju (vreme, mesto, itd.)

3. Implementirajte "Load More" dugme za dodatne rezultate.

## Kvalitet Koda
- Koristite TypeScript za bolju sigurnost tipova.
- Implementirajte rukovanje greškama i indikatore učitavanja.
- Dodajte komentare u kodu.

## Bonus Poeni
- Responsivni dizajn
- Infinite scroll umesto "Load More" dugmeta
- Unit testovi za komponente i store

---

# .cursorrules
```yaml
rules:
  - name: "Kreiraj funkcije za API pozive"
    description: "Funkcije za integraciju sa Ontopo API-jem"
    trigger: "api setup"
    actions:
      - command: "Napraviti funkciju za login"
        script: |
          async function loginAnonymously() {
            const response = await axios.post('https://site.ontopo.work/api/loginAnonymously');
            return response.data.jwt_token;
          }
      - command: "Napraviti funkciju za search token"
        script: |
          async function getSearchToken(jwtToken, criteria) {
            const response = await axios.post(
              'https://site.ontopo.work/api/search_token',
              {
                criteria,
                marketplace_id: '15380287',
                locale: 'en',
                geocodes: ['belgrade']
              },
              {
                headers: { Authorization: `Bearer ${jwtToken}` }
              }
            );
            return response.data.search_id;
          }
      - command: "Napraviti funkciju za search request"
        script: |
          async function searchRestaurants(jwtToken, searchId) {
            const response = await axios.post(
              'https://site.ontopo.work/api/search_request',
              { search_id: searchId },
              {
                headers: { Authorization: `Bearer ${jwtToken}` }
              }
            );
            return response.data.posts;
          }
