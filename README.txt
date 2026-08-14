RoQ Tools PWA — wersja ze wspólną bazą zgłoszeń

NOWE:
- zakładka "Dodaj"
- użytkownicy mogą zgłaszać odkryte receptury
- zgłoszenia trafiają do Google Sheets
- tylko Status = ZATWIERDZONE trafia do wspólnej bazy
- PWA pobiera zatwierdzone receptury automatycznie przy starcie i co 5 minut
- PWA ma nową zakładkę "🖥 PC".
- Link "Zainstaluj RoQ Tools do Tampermonkey" wskazuje względnie na ./roq-tools.user.js.
- W roq-tools.user.js trzeba ustawić:
  1) BACKEND_URL
  2) __GITHUB_USERNAME__ w @updateURL i @downloadURL

Po ustawieniu ZATWIERDZONE receptura staje się dostępna dla wszystkich użytkowników PWA
bez kolejnego wdrażania plików GitHub.



