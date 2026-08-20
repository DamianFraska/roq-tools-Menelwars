# MenelWars Tools

**MenelWars Tools** to PWA oraz skrypt Tampermonkey rozszerzający MenelWars o wspólne narzędzia dla destylarni i gangu.

Aplikacja korzysta ze wspólnego backendu, dzięki czemu dane są synchronizowane pomiędzy użytkownikami oraz wersją PWA i Tampermonkey.

## Najważniejsze moduły

### ⚗ Destylarnia

**Dostępne recepty** — pokazuje najlepsze zatwierdzone receptury dla aktualnie posiadanych składników.

**Nieodkryte** — lista kombinacji, których wynik nie został jeszcze odkryty.

**Rezerwacje receptur** — gracz może zarezerwować nieodkrytą recepturę na 12 godzin, żeby inni wiedzieli, że ktoś już nad nią pracuje.

**Dodaj** — zgłoszenie nowo odkrytej receptury do wspólnej bazy i późniejszej weryfikacji przez administratora.

**Postęp** — statystyki odkrywania receptur oraz ranking graczy, których unikalne receptury zostały zaakceptowane.

---

### 👥 Gang

Prywatna część aplikacji przeznaczona dla członków gangu.

Dostęp do danych zależy od konta oraz aktywnej sesji użytkownika.

**Wpłaty** — dożywotnie saldo `Nadpłata / Dług`, ranking wpłat oraz informacje związane z rozliczeniami graczy.

**Spółka** — informacje o wkładzie graczy w firmę, procentowym udziale oraz przewidywanej pensji.

**Cele** — wspólne cele gangu z aktualną wartością, wartością docelową oraz paskiem postępu.

**Ogłoszenia** — komunikaty dla członków gangu, w tym możliwość oznaczenia najważniejszych informacji jako `📌 Ważne`.

**Ankiety** — głosowania dostępne dla członków gangu. Aplikacja pobiera aktywne ankiety wraz z pozostałymi danymi gangu.

---

### 🛠 Panel administratora

Panel administracyjny umożliwia zarządzanie danymi wykorzystywanymi przez MenelWars Tools.

Administrator może zarządzać m.in.:

- recepturami i ich zgłoszeniami,
- rezerwacjami receptur,
- wpłatami,
- spółką,
- celami,
- ogłoszeniami,
- ankietami,
- graczami i ich dostępem do systemu.

Panel korzysta z osobnej autoryzacji administratora.

---

### 🗺 Mapa

Szybka ściąga aktualnych ustawień mapy MenelWars.

Pozwala sprawdzić potrzebne informacje bez szukania ich ręcznie podczas gry.

---

## 🔐 Konta i dostęp

MenelWars Tools posiada system kont i sesji użytkowników.

Po uruchomieniu aplikacja sprawdza aktualną sesję oraz dostęp użytkownika do prywatnych modułów.

Dane publiczne Destylarni mogą być dostępne niezależnie od prywatnych danych gangu, natomiast moduły gangu i panel administratora wymagają odpowiednich uprawnień.

---

## 🚀 Uruchamianie aplikacji

Podczas startu MenelWars Tools automatycznie przygotowuje dane potrzebne do działania aplikacji.

Ekran ładowania pokazuje aktualny etap oraz procent postępu, m.in.:

- sprawdzanie konta i sesji,
- przygotowanie danych gangu,
- pobieranie danych z serwera,
- przygotowanie receptur,
- ładowanie ankiet,
- pobieranie danych dotyczących wpłat,
- przygotowanie panelu administratora.

Część danych jest pobierana równolegle, aby ograniczyć czas oczekiwania użytkownika.

Po zakończeniu procesu aplikacja wyświetla:

`✅ Dane gotowe — 100%`

i udostępnia przygotowany interfejs.

---

## 🧪 System receptur

Zgłoszenia receptur trafiają do Google Sheets i mogą otrzymać status:

- `OCZEKUJE`
- `ZATWIERDZONE`
- `ODRZUCONE`
- `DUPLIKAT`

Do wspólnej bazy wyników trafiają wyłącznie zatwierdzone receptury.

Identyczne zgłoszenie może zostać oznaczone jako duplikat, natomiast inny wynik tej samej receptury może zostać zaakceptowany jako korekta wcześniejszych danych.

PWA i Tampermonkey pobierają zatwierdzone receptury automatycznie, dlatego aktualizacja samych wyników nie wymaga publikowania nowej wersji aplikacji.

---

## ⏳ Rezerwacje receptur

Nieodkrytą recepturę można zarezerwować na **12 godzin**.

Rezerwacje przechowywane są po stronie backendu i po upływie czasu automatycznie wygasają.

Dzięki temu kilku graczy nie musi jednocześnie sprawdzać tej samej kombinacji.

Administrator może również:

- zwolnić pojedynczą rezerwację,
- wyczyścić wszystkie aktywne rezerwacje.

---

## 💰 Wpłaty

System rozliczeń wykorzystuje ranking łącznych wpłat graczy.

Kolejny zapis stanu jest porównywany z wcześniejszymi danymi, dzięki czemu system może śledzić wpłaty oraz dożywotnie saldo poszczególnych graczy.

Interpretacja salda:

`saldo > 0` → **Nadpłata**

`saldo < 0` → **Dług**

Dane wykorzystywane są również do tworzenia rankingu oraz raportów dotyczących wpłat.

---

## 🏢 Spółka

Spółka pokazuje udział graczy we wspólnym kapitale oraz wynikający z niego podział części dochodu.

Aktualne zasady:

- próg udziału w spółce — **30 000 zł**,
- minimalna pensja zakwalifikowanego gracza — **160 zł**,
- **50%** dziennego dochodu przeznaczane jest na pensje,
- **50%** dziennego dochodu przeznaczane jest na rozwój.

Aplikacja automatycznie wylicza procentowy udział oraz przewidywaną pensję na podstawie aktualnych danych.

---

## 📱 PWA i Tampermonkey

MenelWars Tools dostępny jest w dwóch wariantach.

### PWA

PWA działa jako samodzielna aplikacja internetowa publikowana przez GitHub Pages.

Może być używana zarówno na komputerze, jak i urządzeniach mobilnych.

### Tampermonkey

Na komputerze można zainstalować wersję działającą bezpośrednio wewnątrz MenelWars.

Instalator dostępny jest z PWA przez przycisk:

`💻 Zainstaluj na PC`

Skrypt Tampermonkey korzysta z tego samego backendu co PWA, dlatego dane są wspólne dla obu wersji.

---

## 🔄 Aktualizacje

Po opublikowaniu nowej wersji:

- PWA aktualizuje się przez GitHub Pages,
- Tampermonkey może pobrać nowszą wersję `menelwars-tools.user.js`,
- zmiany danych po stronie backendu nie wymagają ponownego publikowania całej aplikacji,
- aktualizacje samych receptur nie wymagają nowej wersji PWA ani skryptu.

Dzięki temu baza receptur, dane gangu i pozostałe informacje mogą być aktualizowane niezależnie od kodu aplikacji.

---


**MenelWars Tools · autor: RoQ**
