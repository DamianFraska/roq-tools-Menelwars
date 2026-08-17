MenelWars Tools
MenelWars Tools to PWA oraz skrypt Tampermonkey rozszerzający MenelWars o wspólne narzędzia dla destylarni i gangu.
Najważniejsze moduły
⚗ Destylarnia
Dostępne recepty — pokazuje najlepsze zatwierdzone receptury dla posiadanych składników.
Nieodkryte — lista kombinacji do zbadania.
Rezerwacje receptur — gracz może zaklepać nieodkrytą recepturę na 12 godzin, żeby inni wiedzieli, że ktoś już ją robi.
Dodaj — zgłoszenie nowo odkrytej receptury do weryfikacji.
Postęp — statystyki odkryć oraz ranking osób, których unikalne receptury zostały zaakceptowane.
👥 Gang
Prywatny moduł dostępny po haśle gangu.
Wpłaty — dożywotnie saldo `Nadpłata / Dług`, ranking graczy i dzienny raport.
Spółka — wkład w firmę, udział procentowy i przewidywana pensja. Aktualny podział dochodu: 50% pensje / 50% rozwój.
Cele — wspólny cel gangu z wartością aktualną, docelową i paskiem postępu.
Ogłoszenia — kilka aktywnych komunikatów, w tym możliwość oznaczenia `📌 Ważne`.
Admin — narzędzia do zarządzania wpłatami, spółką, celami, ogłoszeniami, graczami i rezerwacjami receptur.
🗺 Mapa
Szybka ściąga aktualnych ustawień mapy MenelWars.
System receptur
Zgłoszenia receptur trafiają do Google Sheets i mają statusy:
`OCZEKUJE`
`ZATWIERDZONE`
`ODRZUCONE`
`DUPLIKAT`
Do wspólnej bazy trafiają tylko zatwierdzone wyniki. Identyczne zgłoszenie może zostać oznaczone jako duplikat, a inny wynik tej samej receptury może zostać zatwierdzony jako korekta.
PWA pobiera zatwierdzone receptury automatycznie, dlatego aktualizacja bazy wyników nie wymaga ponownego wdrażania strony.
Rezerwacje
Rezerwacje nieodkrytych receptur są przechowywane po stronie Apps Script i wygasają automatycznie po 12 godzinach. Administrator może zwolnić pojedynczą rezerwację albo wyczyścić wszystkie naraz.
Wpłaty i spółka
System opiera się na rankingu łącznych wpłat graczy. Kolejny snapshot jest porównywany z poprzednim, dzięki czemu naliczane jest dożywotnie saldo gracza.
dodatnie saldo = Nadpłata
ujemne saldo = Dług
próg udziału w spółce = 30 000 zł
minimalna pensja zakwalifikowanego gracza = 160 zł
dzienny dochód spółki dzielony jest 50% / 50% między pensje i rozwój
PWA i Tampermonkey
PWA działa jako samodzielna strona GitHub Pages.
Na komputerze można zainstalować wersję Tampermonkey bezpośrednio z PWA przez przycisk:
💻 Zainstaluj na PC
Skrypt Tampermonkey korzysta z tej samej wspólnej bazy danych, więc zatwierdzone receptury, wpłaty, cele i ogłoszenia są wspólne dla użytkowników.
Aktualizacje
Po opublikowaniu nowej wersji:
PWA aktualizuje się przez GitHub Pages,
Tampermonkey może pobrać nowszą wersję pliku `menelwars-tools.user.js`,
zmiany samych danych receptur nie wymagają nowej wersji PWA ani skryptu.
---
MenelWars Tools · autor: RoQ