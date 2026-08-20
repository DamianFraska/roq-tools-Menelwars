# MenelWars Tools

**MenelWars Tools** to PWA rozszerzające MenelWars o wspólne narzędzia dla destylarni i gangu.

Aplikacja korzysta ze wspólnego backendu Apps Script i Google Sheets, dzięki czemu dane są synchronizowane pomiędzy użytkownikami bez konieczności publikowania nowej wersji strony przy każdej zmianie danych.

## Najważniejsze moduły

### ⚗ Destylarnia

**Dostępne recepty** — pełna lista zatwierdzonych receptur z filtrami. Składniki premium wpływają wyłącznie na podium Top 3.

**Nieodkryte** — lista kombinacji do zbadania, filtrowanie oraz sekcja recept aktualnie badanych przez innych graczy.

**Rezerwacje receptur** — gracz może zaklepać nieodkrytą recepturę na 12 godzin. Po wykonaniu recepty może przesłać wynik bezpośrednio z rezerwacji.

Jeżeli gracz jest zalogowany, rezerwacja przypisana do jego nicku może być obsługiwana na każdym urządzeniu, na którym zalogowane jest to samo konto. Dla użytkowników niezalogowanych pozostaje zabezpieczenie urządzenia, z którego utworzono rezerwację.

**Dodaj** — zgłoszenie nowo odkrytej receptury do weryfikacji.

**Postęp** — statystyki odkryć oraz ranking osób, których unikalne receptury zostały zaakceptowane.

### 👥 Gang

Prywatny moduł dostępny wyłącznie dla zalogowanych członków gangu.

**Wpłaty** — dożywotnie saldo `Nadpłata / Dług`, ranking graczy i informacje o ostatniej aktualizacji.

**Spółka** — wkład w firmę, udział procentowy i przewidywana pensja. Aktualny podział dochodu: 50% pensje / 50% rozwój. Gracz może dobrowolnie zrzec się części własnej pensji ponad minimalne 160 zł; środki trafiają wtedy do Funduszu.

**Ankiety** — głosowania dostępne dla zalogowanych graczy. Każdy może głosować wyłącznie jako nick przypisany do swojego konta.

**Cele** — wspólny cel gangu z wartością aktualną, docelową i paskiem postępu.

**Ogłoszenia** — kilka aktywnych komunikatów, w tym możliwość oznaczenia `📌 Ważne`.

### 👤 Konto

Każdy gracz posiada konto przypisane do nicku z gry.

Pierwsze ustawienie hasła odbywa się przez kod wygenerowany przez administratora. Konto pozwala korzystać z prywatnych modułów gangu na wielu urządzeniach, zmieniać hasło, sprawdzać aktywne sesje i wylogować pozostałe urządzenia.

### 🛠 Panel administratora

Dostęp do Admina jest uprawnieniem konkretnego konta — nie istnieje osobne hasło administratora.

Panel pozwala zarządzać m.in.:
- zgłoszeniami i wynikami receptur,
- rezerwacjami,
- wpłatami i rankingiem,
- Spółką,
- ankietami,
- celami i ogłoszeniami,
- graczami,
- kontami, kodami resetu i uprawnieniami Admin.

### 🗺 Mapa

Szybka ściąga aktualnych ustawień mapy MenelWars.

## System receptur

Zgłoszenia trafiają do Google Sheets i mają statusy:
- `OCZEKUJE`
- `ZATWIERDZONE`
- `ODRZUCONE`
- `DUPLIKAT`

Do wspólnej bazy trafiają tylko zatwierdzone wyniki. Identyczne zgłoszenie może zostać oznaczone jako duplikat, a inny wynik tej samej receptury może zostać zatwierdzony jako korekta.

PWA automatycznie pobiera zatwierdzone receptury, dlatego aktualizacja samych wyników nie wymaga ponownego wdrażania strony.

## Rezerwacje

Rezerwacje nieodkrytych receptur są przechowywane po stronie Apps Script i standardowo wygasają po 12 godzinach.

Administrator może zwolnić pojedynczą rezerwację albo wyczyścić wszystkie naraz.

Po przesłaniu wyniku rezerwacja pozostaje aktywna do czasu decyzji administratora.

## Wpłaty i Spółka

System opiera się na rankingu łącznych wpłat graczy. Kolejny snapshot jest porównywany z poprzednim, dzięki czemu naliczane jest dożywotnie saldo gracza.

- dodatnie saldo = **Nadpłata**
- ujemne saldo = **Dług**
- próg udziału w Spółce = **30 000 zł**
- minimalna pensja zakwalifikowanego gracza = **160 zł**
- dzienny dochód Spółki = **50% pensje / 50% rozwój**

Dobrowolna rezygnacja z części pensji nie zwiększa pensji innych graczy — różnica trafia do Funduszu.

## Uruchamianie i ładowanie

Po otwarciu PWA aplikacja sprawdza konto i równolegle przygotowuje dane Gangu, ankiet oraz — dla uprawnionych kont — panelu Admina.

Pasek postępu pokazuje wizualny stan ładowania i kończy się na `✅ Dane gotowe`. Warstwa wizualna nie opóźnia faktycznego działania aplikacji.

## Bezpieczeństwo

Prywatne dane Gangu i funkcje administratora wymagają poprawnej sesji konta.

Stary dostęp przez hasło gangu, stare tokeny administratora oraz wcześniejszy skrypt Tampermonkey są wycofane i nie mogą uzyskać dostępu do chronionych danych po wdrożeniu aktualnego backendu.

Publiczna część Destylarni pozostaje dostępna bez konta.

## PWA

MenelWars Tools działa jako samodzielna aplikacja PWA publikowana przez GitHub Pages i może być używana na komputerze oraz telefonie.

Projekt nie korzysta już ze skryptu Tampermonkey.

## Aktualizacje

Po opublikowaniu nowej wersji PWA aktualizuje się przez GitHub Pages.

Zmiany samych danych receptur, wpłat, celów czy ogłoszeń mogą być wykonywane po stronie backendu bez publikowania nowej wersji frontendu.

## Architektura

**PWA**  
↓  
**Backend Google Apps Script**  
↓  
**Google Sheets**

Frontend odpowiada za interfejs, Apps Script za logikę serwera i autoryzację, a Google Sheets pełni rolę wspólnego magazynu danych.

---

**MenelWars Tools · autor: RoQ**
