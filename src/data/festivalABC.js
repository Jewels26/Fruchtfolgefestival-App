// ─── FESTIVAL ABC — Daten für den aufklappbaren A–Z-Guide im Info-Screen ───
// Text-Blöcke unterstützen leichtes Markdown: **fett** und [Linktext](url).
// type 'p' = Absatz, 'ul' = Liste, 'table' = Preistabelle (name/price Paare).

export const FESTIVAL_ABC = [
  {
    id: 'app',
    letter: 'A',
    title: 'App',
    blocks: [
      { type: 'p', text: `**Sie ist fertig!** Unsere Festival-App gibt's ab jetzt hier: [app.fruchtfolge.live](https://app.fruchtfolge.live)` },
      { type: 'p', text: `Einfach draufgehen, herunterladen, installieren, fertig. Kein Appstore, kein Konto, keine Anmeldung mit Blutprobe.` },
      { type: 'p', text: `Drin sind Timetable, Infos und alles, was ihr sonst über den Acker hinweg brüllen müsstet. Am schlauesten installiert ihr sie **vor** der Anreise, dann habt ihr sie schon, wenn ihr sie braucht.` },
    ],
  },
  {
    id: 'anreise-auto',
    letter: 'A',
    title: 'Anreise mit dem Auto',
    blocks: [
      { type: 'p', text: `Ihr wollt zu **Lindach 4, 82256 Fürstenfeldbruck**. Oder ihr klickt einfach hier: [Google Maps](https://maps.app.goo.gl/KjAxBuE5DELEcLXU8)` },
      { type: 'p', text: `**Achtung, Baustelle!** Die **B471 ist von Inning her (also von der A96 kommend) bis Fürstenfeldbruck gesperrt**. Wer aus dem Süden anrollt, plant bitte um. Aus **nördlicher Richtung (Dachau, A8) kommt ihr ganz normal durch**. Aktuelle Infos zur Sperrung gibt's [hier bei der Stadt Fürstenfeldbruck](https://www.fuerstenfeldbruck.de/ffb/web.nsf/id/li_sperrung-b471.html).` },
    ],
  },
  {
    id: 'anreise-bus-bahn',
    letter: 'A',
    title: 'Anreise mit Bus & Bahn',
    blocks: [
      { type: 'p', text: `Wir lieben Menschen, die uns die Wiese nicht zuparken. Deshalb: **Wer öffentlich anreist, bekommt gegen Nachweis einen kleegrünen Welcome-Pfeffi.** Einfach das Öffi-Ticket am Einlass herzeigen und minzig begrüßt werden.` },
      { type: 'p', text: `**Aus München:** Mit der **S3 bis Maisach**, dort in den **Bus 873 Richtung Fürstenfeldbruck**, aussteigen an der Haltestelle „Lindach, Abzw.". Ab da einfach den Schildern folgen, verlaufen kann man sich eigentlich nur, wenn man's drauf anlegt.` },
      { type: 'p', text: `**Aus Fürstenfeldbruck:** Ebenfalls der **Bus 873**, nur in die andere Richtung (nach Maisach). Auch hier: „Lindach, Abzw."` },
      { type: 'p', text: `**Wichtig: Bitte NICHT die S4 nach Fürstenfeldbruck nehmen!** An genau dem Wochenende ist die Strecke gesperrt, der Bahnhof Fürstenfeldbruck wird nicht von der S-Bahn angefahren, es gibt Schienenersatzverkehr. Alle Details dazu bei der [S-Bahn München](https://www.s-bahn-muenchen.de/de/fahren/baustellen/s4). Nehmt lieber die S3 über Maisach.` },
    ],
  },
  {
    id: 'abendkasse',
    letter: 'A',
    title: 'Abendkasse',
    blocks: [
      { type: 'p', text: `Ehrliche Antwort: **vielleicht.** Wenn nach dem Vorverkauf noch Restkarten übrig sind, machen wir eine Abendkasse auf, aber garantieren können wir das nicht. Und weil unsere Buchhaltung auch ein Herz aus Ackerkrume hat: **Karten an der Abendkasse sind teurer.**` },
      { type: 'p', text: `Kurzum: Schlagt im Vorverkauf zu. Spart Geld, spart Nerven!` },
    ],
  },
  {
    id: 'awareness',
    letter: 'A',
    title: 'Awareness',
    blocks: [
      { type: 'p', text: `Unser gesamtes Team ist Awareness-Team. **Alle Helfer:innen erkennt ihr an Badges und Crew-Shirts**, dazu kommen die offiziellen Ordner:innen in Uniform. Alle sind geschult, alle sind ansprechbar, und alle können jederzeit unsere Hauptansprechpartnerin dazuholen.` },
      { type: 'p', text: `Neu und nicht zu übersehen: Wir haben dieses Jahr **dedizierte Awareness-Leute, die den ganzen Abend nichts anderes tun, als auf euch zu achten**. Erkennen könnt ihr sie an einem **eindeutigen Haarreif** – man kann sie schlicht nicht verwechseln. Wenn ihr Hilfe braucht, haltet einfach Ausschau nach dem Kopfschmuck.` },
      { type: 'p', text: `Und es bleibt dabei: **Ihr könnt jede Person mit Crew-Shirt oder Badge ansprechen**, egal ob mit oder ohne Haarreif. Wir kümmern uns dann sofort darum.` },
      { type: 'p', text: `Wenn euch etwas komisch vorkommt, wenn sich jemand daneben benimmt, wenn ihr euch unwohl fühlt oder wenn ihr einfach jemanden braucht: **Sprecht uns an.** Egal wie klein euch die Sache vorkommt. Dafür sind wir da.` },
    ],
  },
  {
    id: 'barrierefreiheit',
    letter: 'B',
    title: 'Barrierefreiheit',
    blocks: [
      { type: 'p', text: `Ganz ehrlich und ohne Beschönigung: **Wir sind auf einem Feld.** Acker, Wiese, Naturboden, kein Asphalt. Das heißt, unser Gelände ist derzeit **leider nicht barrierefrei**, weder die Wege noch die Sanitäranlagen.` },
      { type: 'p', text: `Das tut uns aufrichtig leid, und wir bitten um Verständnis. Wir arbeiten daran, das in den kommenden Jahren besser hinzubekommen. Wenn ihr trotzdem kommen wollt und wissen möchtet, was vor Ort geht: **schreibt uns vorher**, dann schauen wir gemeinsam, was sich machen lässt.` },
    ],
  },
  {
    id: 'baendchen',
    letter: 'B',
    title: 'Bändchen',
    blocks: [
      { type: 'p', text: `Beim ersten Einlass wird euer Ticket gescannt und entwertet, im Tausch gibt's euer **Festivalbändchen**. Das kommt ans Handgelenk und bleibt da. Das ganze Wochenende.` },
      { type: 'p', text: `**Kaputt oder abgemacht = ungültig.** Dann kommt ihr weder aufs Gelände noch auf den Campingplatz zurück. Also: nicht dran rumzupfen, auch wenn's juckt.` },
    ],
  },
  {
    id: 'bargeld',
    letter: 'B',
    title: 'Bargeld (und Karte!)',
    blocks: [
      { type: 'p', text: `Gute Nachricht für alle, die es beim Abheben vergessen haben: **Wir haben jetzt auch Kartenzahlung.** An der Kasse am Einlass, an der Bar, beim Essen und am Merch-Stand könnt ihr ganz normal mit Karte zahlen.` },
      { type: 'p', text: `Eine kleine Bitte trotzdem: **Bargeld ist uns lieber.** Bei jeder Kartenzahlung gehen Gebühren ab, und die fehlen uns dann an anderer Stelle – beim Line-up, beim Klee, beim Pfeffi. Wer also ohnehin Scheine dabei hat: immer gern.` },
      { type: 'p', text: `Zwei Dinge noch:` },
      { type: 'ul', items: [
        `**Es gibt keinen Geldautomaten auf dem Gelände.** Hebt lieber vorher ab.`,
        `**Die Spenden an der Zanzibar gehen ausschließlich in Bargeld.** Dort steht kein Kartenlesegerät, dort steht Bärwurz. Also: ein paar Münzen einstecken (siehe **Z wie Zanzibar**).`,
      ] },
    ],
  },
  {
    id: 'camping',
    letter: 'C',
    title: 'Camping',
    blocks: [
      { type: 'p', text: `**Im 2-Tagesticket ist der Campingplatz inklusive.** Kein Aufpreis, kein Extra-Ticket, keine Geheimgebühr.` },
      { type: 'ul', items: [
        `**Ab Freitag 14:00 Uhr** könnt ihr euer Wohnzimmer aufbauen.`,
        `**Bis Sonntag 14:00 Uhr** muss der Platz wieder geräumt sein. Danach gehört die Wiese wieder dem Klee.`,
        `Einen bestimmten Platz können wir nicht reservieren: unser Einweisungsteam sagt euch, wo's hingeht.`,
      ] },
      { type: 'p', text: `**Wichtig:** Der Campingplatz ist nur für Leute mit **2-Tagesticket**. Mit einer Tageskarte kommt ihr leider nicht in den Campinggenuss, auch nicht eine Nacht.` },
    ],
  },
  {
    id: 'cannabis',
    letter: 'C',
    title: 'Cannabis',
    blocks: [
      { type: 'p', text: `Kurz und klar: **Cannabis ist in Deutschland legal, und unser Festival ist ohnehin ab 18.** Ihr müsst also nicht heimlich hinterm Dixi verschwinden.` },
      { type: 'p', text: `Ein paar Dinge, die uns trotzdem am Herzen liegen:` },
      { type: 'ul', items: [
        `**Es bleibt bei den gesetzlichen Grenzen.** Erlaubt ist, was erlaubt ist. Weitergabe, Verkauf oder Handel auf dem Gelände sind es nicht. Wer dealt, fliegt.`,
        `**Alles andere bleibt verboten.** Illegale Substanzen sind bei uns weiterhin tabu, daran ändert die Legalisierung nichts.`,
        `**Denkt an eure Nachbarn.** Nicht alle mögen den Geruch, manche vertragen ihn schlecht. Ein bisschen Rücksicht auf der Wiese kostet nichts.`,
        `**Und ganz wichtig: Wir stehen auf einem knochentrockenen Feld.** Was für Grills und Fackeln gilt, gilt auch für Kippen und Joints. **Glut gehört ausgedrückt, nicht weggeschnippt.** Bringt einen Taschenaschenbecher mit oder nutzt unsere Behälter. Ein brennender Acker wäre das unlustigste Late Night Special der Festivalgeschichte.`,
        `**Wer fährt, fährt nüchtern.** Auch das ändert sich durch die Legalisierung nicht. Siehe **R wie Ruftaxi**.`,
      ] },
    ],
  },
  {
    id: 'duschen-dixies',
    letter: 'D',
    title: 'Duschen & Dixies',
    blocks: [
      { type: 'p', text: `Ja, es gibt beides! **Duschen mit Waschbereich** und **ausreichend Dixi-Toiletten**. Ihr müsst also weder verwahrlosen noch in die Ackerkrume sch***en.` },
    ],
  },
  {
    id: 'einlass',
    letter: 'E',
    title: 'Einlass & Einlasszeiten',
    blocks: [
      { type: 'ul', items: [
        `**Freitag:** Camping ab 14:00 Uhr, Festivalgelände ab 16:00 Uhr`,
        `**Samstag:** Festivalgelände ab 12:00 Uhr`,
        `**Schluss:** an **beiden** Tagen jeweils um **00:00 Uhr**`,
      ] },
      { type: 'p', text: `Ja, auch am Freitag ist um Mitternacht Feierabend auf der Bühne. Das ist keine Schikane, sondern der Lärmschutz – und der ist auf dem Land ein besonders lichtempfindliches Pflänzchen. Rundherum wohnen Menschen, die morgens die Kühe nicht auf „später" stellen können. Wir wollen nächstes Jahr wiederkommen, und dafür halten wir uns brav an die Uhr.` },
      { type: 'p', text: `Die guten Nachrichten: Bis dahin geben wir alles. Und danach ist auf dem Campingplatz noch lange nicht Schluss – nur eben in **Gesprächslautstärke** (siehe **N wie Nachtruhe**).` },
      { type: 'p', text: `Am Einlass braucht ihr euer gültiges Ticket – digital auf dem Handy oder ausgedruckt, aber bitte **unentwertet und nicht zerknüllt**.` },
    ],
  },
  {
    id: 'erste-hilfe',
    letter: 'E',
    title: 'Erste Hilfe',
    blocks: [
      { type: 'p', text: `Wir haben eine **Ersthelferin vor Ort** und **Verbandskästen am Eingang**. Für alles Ernsthafte gilt wie überall: **112**.` },
      { type: 'p', text: `Kleiner Hinweis von euren Fruchtfliegen: Trinkt Wasser. Esst was. Schlaft ein bisschen. Die meisten Notfälle auf Festivals sind eigentlich nur schlecht getarnte Dehydrierung.` },
    ],
  },
  {
    id: 'essen',
    letter: 'E',
    title: 'Essen',
    blocks: [
      { type: 'p', text: `Kein Mensch soll bei uns hungrig durch die Reihen wanken. Es gibt:` },
      { type: 'ul', items: [`Gegrilltes`, `Hot Dogs`, `Pommes`, `Falafel`] },
      { type: 'p', text: `**Alles auch vegetarisch und vegan**: bei uns muss keiner traurig am Salatblatt knabbern. Preislich bewegen wir uns zwischen **3 und 6 Euro**.` },
      { type: 'p', text: `**Allergien?** Fragt einfach beim Personal am Stand nach, die wissen Bescheid und helfen euch gerne weiter.` },
    ],
  },
  {
    id: 'fahrrad',
    letter: 'F',
    title: 'Fahrrad',
    blocks: [
      { type: 'p', text: `Radler:innen sind bei uns Ehrengäste. Es gibt für euch **ein Welcome-Radler** obendrauf.` },
      { type: 'p', text: `Aber: **Wir haben keine Fahrradständer.** Bringt bitte ein Schloss mit und lehnt euer Radl irgendwo Sinnvolles an.` },
    ],
  },
  {
    id: 'feuer',
    letter: 'F',
    title: 'Feuer',
    blocks: [
      { type: 'p', text: `**Kein offenes Feuer, keine Grills, keine Fackeln.** Es ist trocken, wir stehen auf einem Feld, und ein abgefackelter Acker wäre für die Fruchtfolge dann doch etwas zu radikal.` },
      { type: 'p', text: `Kleine **Campinggaskocher sind erlaubt**, Kaffee am Samstagmorgen muss sein. Sollte die Feuerwehr uns aber empfehlen, auch die einzuschränken, tun wir das kurzfristig. Bitte habt dafür Verständnis.` },
    ],
  },
  {
    id: 'fotos',
    letter: 'F',
    title: 'Fotos',
    blocks: [
      { type: 'p', text: `**Fotografieren ist ausdrücklich erwünscht** – auch mit richtiger Kameraausrüstung. Macht schöne Bilder, verlinkt uns, taggt uns.` },
      { type: 'p', text: `Umgekehrt gilt: Mit dem Betreten des Geländes stimmt ihr zu, dass ihr auf unseren Fotos und Videos landen könnt und wir diese für Website, Social Media und Presse verwenden dürfen.` },
    ],
  },
  {
    id: 'gehoerschutz',
    letter: 'G',
    title: 'Gehörschutz',
    blocks: [
      { type: 'p', text: `**Bringt welchen mit.** Wirklich. Euer Gehör wächst nicht nach wie Klee.` },
      { type: 'p', text: `Wer's vergisst: Wir haben **Gehörschutz gegen eine kleine Spende** dabei.` },
    ],
  },
  {
    id: 'glas',
    letter: 'G',
    title: 'Glas',
    blocks: [
      { type: 'p', text: `**Glas ist erlaubt bei uns**, auch im Infield, weil ihr alle verantwortungsvolle Menschen seid. Wir erlauben jedoch nicht das Mitbringen von Getränken ins Infield. Gebt eure Spenden für die Zanzibar (siehe weiter unten) am Eingang ab, sie erwarten euch in all ihrer enzianigen Schrecklichkeit an der Zanzibar wieder.` },
    ],
  },
  {
    id: 'hunde',
    letter: 'H',
    title: 'Hunde',
    blocks: [
      { type: 'p', text: `Hunde dürfen mit, **wenn sie durchgehend an der Leine geführt werden**.` },
      { type: 'p', text: `Aber ganz im Ernst, von Herzen: **Lasst eure Hunde lieber daheim.** Ein Musikfestival ist für Tiere richtig, richtig viel Stress. Lärm, Menschenmassen, fremde Gerüche, kein Rückzugsort. Eurem Vierbeiner ist mit einem ruhigen Wochenende bei Oma deutlich mehr geholfen. Bei auffälligem Verhalten müssen wir leider einen Platzverweis aussprechen.` },
    ],
  },
  {
    id: 'handynetz',
    letter: 'H',
    title: 'Handynetz',
    blocks: [
      { type: 'p', text: `**Netz ist da.** Ihr könnt also posten, streamen, eure Freunde herbeirufen. Und zum Laden stellen wir euch **Steckdosen** zur Verfügung.` },
    ],
  },
  {
    id: 'infield',
    letter: 'I',
    title: 'Infield',
    blocks: [
      { type: 'p', text: `So nennen wir den eigentlichen Festivalbereich vor der Bühne. Dort gilt:` },
      { type: 'ul', items: [
        `**Keine eigenen Getränke** – die gibt's bei uns, und zwar günstig (siehe unten).`,
        `**Taschen bis zur Größe eines kleinen Rucksacks** dürfen mit rein. Alles, was eher nach Umzugskarton aussieht, bleibt draußen.`,
        `**Unser Security-Personal schaut in die Taschen rein** und sucht nach verbotenen Gegenständen (siehe **V wie Verbotene Gegenstände**). Das geht schnell, das tut nicht weh, und es ist einfach Fürsorge für alle. Wer vorher grob aufräumt, kommt schneller durch.`,
        `**Kostenloses Trinkwasser** steht bereit.`,
      ] },
    ],
  },
  {
    id: 'jugendschutz',
    letter: 'J',
    title: 'Jugendschutz',
    blocks: [
      { type: 'p', text: `**Das Fruchtfolgefestival ist ab 18.** Ohne Ausnahme, ohne Muttizettel, ohne „aber ich bin fast 18". Der Ticketkauf und der Einlass sind erst ab 18 Jahren möglich. Bringt bitte einen Ausweis mit.` },
    ],
  },
  {
    id: 'klee',
    letter: 'K',
    title: 'Klee',
    blocks: [
      { type: 'p', text: `Nach dem Hopfen kommt der Klee – so will es die Fruchtfolge, so will es Joe, und so wollen es die Regeln der Landwirtschaft.` },
      { type: 'p', text: `Klee ist übrigens die perfekte Feldfrucht für ein Festival wie unseres: Er bindet Stickstoff, macht den Boden für alle danach besser und wächst am liebsten im Verbund. Kommt euch bekannt vor? Uns auch.` },
      { type: 'p', text: `Und wenn ihr ein vierblättriges findet: behaltet es. Ihr habt es euch verdient.` },
    ],
  },
  {
    id: 'kartenzahlung',
    letter: 'K',
    title: 'Kartenzahlung',
    blocks: [
      { type: 'p', text: `**Gibt's jetzt!** An Einlass, Bar, Essensstand und Merch könnt ihr mit Karte zahlen.` },
      { type: 'p', text: `Nur an der **Zanzibar** bleibt es beim Bargeld, dort läuft alles über frei gewählte Spenden.` },
      { type: 'p', text: `Und ganz leise gesagt: **Über Bargeld freuen wir uns mehr**, weil dann keine Gebühren abgehen. Aber niemand muss deswegen hungrig oder durstig bleiben – siehe **B wie Bargeld (und Karte!)**.` },
    ],
  },
  {
    id: 'lineup',
    letter: 'L',
    title: 'Line-up',
    blocks: [
      { type: 'p', text: `**Freitag, 28.08.** Heckspoiler (AT) · Wuolja (ES) · AKaRinde · Powasser & Moskau78 · Fritz Sauerkraut – Late Night Special: **DNVZ**` },
      { type: 'p', text: `**Samstag, 29.08.** Skraeckoedlan (SE) · Poolhead · Señorez Cabronez (ES) · Odysseus · Dessert Oracle · Fromage vom Arsch · Träsh · Räckler · Orchid Tribe · **Mad Mother**` },
      { type: 'p', text: `Die genauen Spielzeiten findet ihr im **Timetable auf unserer Startseite, bei Instagram oder auf unserer App**.` },
    ],
  },
  {
    id: 'merch',
    letter: 'M',
    title: 'Merch',
    blocks: [
      { type: 'p', text: `Bandmerch? Selbstverständlich. Direkt von den Künstler:innen, direkt in eure Sammlung.` },
      { type: 'p', text: `Und von uns? Sagen wir mal so: **Es könnte sein, dass da noch das eine oder andere fruchtige Gimmick am Stand liegt.** Mehr verraten wir nicht. Guckt einfach vorbei, bevor es weg ist. (Denkt an **B wie Bargeld**.)` },
    ],
  },
  {
    id: 'nachtruhe',
    letter: 'N',
    title: 'Nachtruhe',
    blocks: [
      { type: 'p', text: `Auf dem Campingplatz gilt **von 00:00 bis 08:00 Uhr Nachtruhe**. Musik bitte nur in **Gesprächslautstärke** – die Bluetooth-Box darf mit, aber nicht auf Anschlag.` },
      { type: 'p', text: `Wir wohnen hier nicht allein: rundherum sind Nachbarn, Tiere und Menschen, die morgens raus müssen. Und ehrlich, ein bisschen Schlaf tut euch am Samstag auch ganz gut.` },
    ],
  },
  {
    id: 'notfall',
    letter: 'N',
    title: 'Notfall',
    blocks: [
      { type: 'p', text: `**112.** Und danach direkt jemanden aus dem Team ansprechen, damit wir helfen und die Rettung einweisen können.` },
    ],
  },
  {
    id: 'parken',
    letter: 'P',
    title: 'Parken',
    blocks: [
      { type: 'p', text: `**Kostenlos und ohne Anmeldung.** Einfach kommen, unser Team weist euch ein.` },
      { type: 'p', text: `Und nochmal: **Camping gibt's nur mit dem 2-Tagesticket.**` },
    ],
  },
  {
    id: 'pavillon',
    letter: 'P',
    title: 'Pavillon',
    blocks: [
      { type: 'p', text: `**Pavillons sind erlaubt**. Schatten und Regenschutz sind auf einem Feld Gold wert.` },
      { type: 'p', text: `**Nicht erlaubt:** motorbetriebene **Stromaggregate**. Die sind laut, stinken und passen ungefähr so gut zu einem Kleefeld wie ein Presslufthammer zur Meditation.` },
    ],
  },
  {
    id: 'pfeffi',
    letter: 'P',
    title: 'Pfeffi',
    blocks: [
      { type: 'p', text: `Ein Euro. **Ein Euro.**` },
    ],
  },
  {
    id: 'ruftaxi',
    letter: 'R',
    title: 'Ruftaxi',
    blocks: [
      { type: 'p', text: `Ihr wollt nachts noch heim, aber der Bus fährt nicht mehr? Nach Betriebsschluss könnt ihr ein **Ruftaxi zum MVG-Tarif** bestellen. Alle Infos, Zeiten und die Nummer findet ihr in der [Ruftaxi-Broschüre des Landkreises Fürstenfeldbruck (PDF)](https://www.lra-ffb.de/fileadmin/user_upload/lra-ffb/pdf/OEPNV/2022_RufTaxi8000_L.pdf).` },
      { type: 'p', text: `Speichert euch das lieber vorher ab. Um zwei Uhr nachts ein PDF suchen macht keinen Spaß.` },
    ],
  },
  {
    id: 'sicherheitskontrolle',
    letter: 'S',
    title: 'Sicherheitskontrolle',
    blocks: [
      { type: 'p', text: `Am Einlass und auf dem Gelände darf unser Sicherheitspersonal **Taschen kontrollieren und Leibesvisitationen** durchführen. Das ist kein Misstrauen, das ist einfach Fürsorge für alle.` },
      { type: 'p', text: `Da wir auch ein bisschen auf unseren leckeren Getränkekonsum angewiesen sind, von euch und zu fairen Preisen von uns, sind keine mitgebrachten Getränke im Infield erlaubt. Aber wir wären nicht die Fruchtfolge, wenn es auch nicht da eine Ausnahme gäbe, siehe **Z wie Zanzibar.**` },
      { type: 'p', text: `Wer die Kontrolle verweigert, kommt nicht rein und bekommt kein Geld zurück. Gleiches gilt für Menschen, die schon vor dem Tor komplett neben der Spur stehen.` },
    ],
  },
  {
    id: 'tickets',
    letter: 'T',
    title: 'Tickets',
    blocks: [
      { type: 'p', text: `Tickets gibt's bei [Eventfrog](https://eventfrog.de/de/p/festivals/pop-rock/fruchtfolgefestival-2026-7428465056327708123.html):` },
      { type: 'ul', items: [
        `**2-Tagesticket inkl. Camping:** 50,48 € (Gesamtpreis inkl. Gebühren)`,
        `**Tageskarte Freitag:** 28,75 € (Gesamtpreis inkl. Gebühren)`,
        `**Tageskarte Samstag:** 37,03 € (Gesamtpreis inkl. Gebühren)`,
      ] },
      { type: 'p', text: `**Der Online-Verkauf endet am Donnerstag, 27.08.2026 um 18:00 Uhr.**` },
    ],
  },
  {
    id: 'trinkwasser',
    letter: 'T',
    title: 'Trinkwasser',
    blocks: [
      { type: 'p', text: `**Kostenlos, auf dem ganzen Gelände.** Bringt eine Flasche mit und füllt euch nach. Euer Kopf am Sonntag wird es euch danken.` },
    ],
  },
  {
    id: 'verbotene-gegenstaende',
    letter: 'V',
    title: 'Verbotene Gegenstände',
    blocks: [
      { type: 'p', text: `Bitte lasst zuhause:` },
      { type: 'ul', items: [
        `Waffen jeder Art`,
        `Illegale Drogen`,
        `Pyrotechnik und Fackeln`,
        `Verbotene politische oder diskriminierende Symbole`,
        `Motorbetriebene Stromaggregate`,
        `Grills und offenes Feuer`,
      ] },
      { type: 'p', text: `Das gilt auf dem **gesamten Gelände inklusive Campingplatz**. Wer damit erwischt wird, fliegt ohne Erstattung.` },
    ],
  },
  {
    id: 'vielfalt',
    letter: 'V',
    title: 'Vielfalt',
    blocks: [
      { type: 'p', text: `Das ist uns wichtig genug für einen eigenen Buchstaben:` },
      { type: 'p', text: `So wie ein Acker nur aufblüht, wenn verschiedene Feldfrüchte wachsen dürfen, lebt auch unser Festival von Vielfalt. Egal wo du herkommst, wen du liebst, wie du aussiehst, wie du dich fühlst oder wie du dein Leben lebst – **du bist hier willkommen.**` },
      { type: 'p', text: `Und genauso klar: **Diskriminierung hat bei uns keinen Platz. Rechtsextremismus hat bei uns nichts verloren.** Wer das nicht mitträgt, ist auf dem falschen Feld.` },
    ],
  },
  {
    id: 'verpflegung-mitbringen',
    letter: 'V',
    title: 'Verpflegung selbst mitbringen',
    blocks: [
      { type: 'p', text: `**Auf dem Campingplatz:** klar, selbstverständlich, bringt mit was ihr braucht.` },
      { type: 'p', text: `**Im Infield:** eigene Getränke bleiben draußen. Dafür sind unsere Preise auch keine Frechheit (siehe **W wie Was kostet ein Bier**).` },
    ],
  },
  {
    id: 'was-kostet-ein-bier',
    letter: 'W',
    title: 'Was kostet ein Bier?',
    blocks: [
      { type: 'p', text: `Setzt euch:` },
      { type: 'table', rows: [
        { name: 'Leitungswasser', price: 'kostenlos' },
        { name: 'Pfeffi', price: '1 €' },
        { name: 'Sprudelwasser', price: '2 €' },
        { name: 'Softdrinks, Radler, alkoholfreies Bier', price: '3 €' },
        { name: 'Bier', price: '4 €' },
        { name: 'Weinschorle', price: '5 €' },
        { name: 'Diskoschorle', price: '6 €' },
        { name: 'Longdrinks', price: '7 €' },
      ] },
    ],
  },
  {
    id: 'wetter',
    letter: 'W',
    title: 'Wetter',
    blocks: [
      { type: 'p', text: `**Wir spielen bei jedem Wetter.** Regen ist nur flüssiger Sonnenschein, und auf einem Acker gehört Matsch zum Konzept.` },
      { type: 'p', text: `Nur wenn es wirklich gefährlich wird, schweres Unwetter, Sturm, Hagel, müssen wir unterbrechen oder abbrechen. Sicherheit geht vor Setlist.` },
      { type: 'p', text: `Was das für euch heißt: **Gummistiefel, Regenjacke, warme Klamotten für die Nacht.** Und Sonnencreme, denn Ende August kann auch das Gegenteil passieren.` },
    ],
  },
  {
    id: 'wiedereinlass',
    letter: 'W',
    title: 'Wiedereinlass',
    blocks: [
      { type: 'p', text: `Kein Problem, **solange euer Bändchen unbeschädigt am Handgelenk sitzt**. Ihr könnt zwischen Gelände und Campingplatz hin- und herwandern, so oft ihr wollt.` },
    ],
  },
  {
    id: 'zanzibar',
    letter: 'Z',
    title: 'Zanzibar',
    blocks: [
      { type: 'p', text: `Kennt ihr das? Ganz hinten im Schrank steht seit dem letzten Geburtstag noch ein Fingerbreit Obstler. Daneben ein Nörgerl Kräuterlikör, das keiner mehr anfasst. Genau die meinen wir.` },
      { type: 'p', text: `Bringt eure Schnapsnörgerl mit und spendet sie unserer Zanzibar! Dort werden die gesammelten Restbestände gegen eine frei gewählte Spende ausgeschenkt, ihr entscheidet, was es euch wert ist. Was reinkommt, bleibt im Festival.` },
      { type: 'p', text: `Eine kleine Einschränkung müssen wir uns leider erlauben: Wir behalten uns vor zu sortieren. Kistenweise Gin werden wir an der Zanzibar nicht sehen, den gibt's ordentlich an der Bar. Aber ein Bärwurz aus der Steinflasche, ein rätselhafter Selbstgebrannter von Onkel Sepp, ein Likör mit handgeschriebenem Etikett? Her damit. Genau dafür wurde die Zanzibar erfunden.` },
    ],
  },
  {
    id: 'zelt',
    letter: 'Z',
    title: 'Zelt',
    blocks: [
      { type: 'p', text: `Bringt eins mit, wenn ihr bleibt. **Heringe, die auch in trockenen Boden gehen**, sind übrigens die beste Investition eures Wochenendes.` },
    ],
  },
  {
    id: 'zusammenkehren',
    letter: 'Z',
    title: 'Zusammenkehren',
    blocks: [
      { type: 'p', text: `Wir bitten euch von Herzen: **Nehmt euren Müll wieder mit.** Der Acker hier ist kein Festivalgelände, sondern ein Feld, auf dem nächstes Jahr wieder etwas wachsen soll. Was ihr liegen lasst, liegt buchstäblich im Boden.` },
      { type: 'p', text: `Zeltleichen, Campingstühle, Kartons – alles, was ihr herbringt, könnt ihr auch wieder mitnehmen. Wir danken euch unglaublich dafür!` },
    ],
  },
]

export function entrySearchText(entry) {
  const bodyText = entry.blocks.map(block => {
    if (block.type === 'ul') return block.items.join(' ')
    if (block.type === 'table') return block.rows.map(r => `${r.name} ${r.price}`).join(' ')
    return block.text
  }).join(' ')
  return `${entry.letter} ${entry.title} ${bodyText}`.toLowerCase()
}
