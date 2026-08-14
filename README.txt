RoQ Tools PWA — wersja ze wspólną bazą zgłoszeń

NOWE:
- zakładka "Dodaj"
- użytkownicy mogą zgłaszać odkryte receptury
- zgłoszenia trafiają do Google Sheets
- tylko Status = ZATWIERDZONE trafia do wspólnej bazy
- PWA pobiera zatwierdzone receptury automatycznie przy starcie i co 5 minut

KONFIGURACJA BACKENDU:
1. Wklej roq_tools_receptury_backend.gs do Apps Script powiązanego z arkuszem.
2. Uruchom UtworzSystemZgloszen().
3. Deploy > New deployment > Web app.
4. Execute as: Me.
5. Who has access: Anyone.
6. Skopiuj URL kończący się na /exec.
7. Otwórz app.js.
8. Podmień:
   const BACKEND_URL = "WKLEJ_TUTAJ_URL_WEB_APP";
   na URL z Apps Script.
9. Wgraj zmienione pliki PWA na GitHub.
10. Po aktualizacji zamknij/otwórz PWA albo odśwież ją, aby nowy service worker się aktywował.

MODERACJA:
W arkuszu RecepturyZgloszenia zmieniasz Status:
- OCZEKUJE
- ZATWIERDZONE
- ODRZUCONE

Po ustawieniu ZATWIERDZONE receptura staje się dostępna dla wszystkich użytkowników PWA
bez kolejnego wdrażania plików GitHub.
