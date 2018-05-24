# FlowFriend

## Opis
Aplikacja pomagająca trzymać się swoich celów/postanowień. Zawiera takie funkcje jak:
+ możliwość codziennego oznaczania postanowień
+ możliwość dodawania/usuwania postanowień
+ możliwość edycji aktualnego postanowienia
+ możliwość ustalenia korzyści z realizacji celu (dodatkowa motywacja)
+ wybór w które dni cel nie obowiązuje
+ łatwe przechodzenie między aktualnymi postanowieniami
+ licznik aktualnego wyniku i najwyższego wyniku (oznaczeń "wykonano" pod rząd)
+ możliwość zmiany miejsca postanowienia na liście (draggable)
+ statystyka oznaczeń w postaci wykresu kołowego
+ jest dostępna i odpowiednio wyskalowana pod urządzenia mobilne

## Wygląd aplikacji
### Logowanie
![alt text](https://zapodaj.net/images/1a7d613e5abba.png)

### Oznaczanie postanowień i statystyki
![alt text](http://fotserv.pl/upload/1525966215-4-ff.png)

### Dodawanie nowych postanowień
![alt text](http://fotserv.pl/upload/1525966254-5-ff.png)

### Wygląd kalendarza na urządzeniach mobilnych
![alt text](http://fotserv.pl/upload/1525966281-6-ff.png)

## Użyte technologie i pluginy
+ Java: Spring Boot, Hibernate, Thymeleaf
+ Baza danych: PostgreSQL
+ Technologie webowe: HTML, CSS, SASS, JS, JQuery (UI), Bootstrap, 
+ Inne: Git, Maven, FontAwesome, pluginy: autosize (automatyczne dopasowanie wielkości TextArea), jquery.ui.touch (obsługa draggable na urządzeniach mobilnych), perfect-scrollbar (scrollbar dla listy celów), animate.css (animacje css)

## Czego się nauczyłem? Co dał mi projekt?
+ nauczyłem się jak stworzyć podstawową strukturę bazy danych (przypisanie celów do odpowiedniego usera, a kafelków do odpowiedniego celu - klucze obce, relacje OneToMany/ManyToOne)
+ rozwiązywałem złożone problemy różnego typu
+ nauczyłem się podstaw tworzenia responsywnych stron w oparciu o framework Bootstrap
+ nauczyłem się podstaw SASS'a i dlaczego właściwie warto go używać
+ nauczyłem się korzystania z wielu dostępnych w internecie pluginów (wymienionych wyżej) i dostosowywania ich pod własne potrzeby
+ poszerzyłem swoją wiedzę w temacie JPA/Hibernate/EntityManager'a (budowa zapytań i inne)
+ polepszyłem swoje "wyczucie artystyczne" i umiejętności w budowie ładnych, przejrzystych stron przy wykorzystaniu animacji oraz stylów CSS
+ poszerzyłem swoją wiedzę w temacie JavaScriptu o zapytania AJAX (odbieranie/wysyłanie danych), obiektowość, zmienne let i var oraz inne aspekty
+ rozwinąłem się w temacie Gita - commity, komentarze, użycie SourceTree i inne
+ wyrobiłem w sobie umiejętność przewidywania zamiarów użytkownika w stosunku do aplikacji ("a co się stanie jakbym niestandardowo kliknął tutaj? jakie to będzie mieć konsekwencje? jak mogę temu zapobiec? czego jeszcze nie wiem?")
+ ogólnie dużo się nauczyłem i rozwiązałem wiele ciekawych problemów

## Kolejne kroki:
+ naprawa bugów i błędów
+ lepsze zabezpieczenie aplikacji/bardziej złożony system logowania i kontroli danych użytkownika (może w oparciu o OAuth2 albo Spring Cloud)
+ implementacja dodatkowych funkcjonalności - notatek, ikon dla każdego celu i innych
+ testy jednostkowe
+ dopracowanie aplikacji pod względem wyglądu
+ (?) przepisanie aplikacji na Angulara (klient), oczywiście serwis zostaje bez zmian w Springu

