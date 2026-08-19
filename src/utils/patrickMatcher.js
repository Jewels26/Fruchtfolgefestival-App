import { LINEUP } from '../data/lineup'
import { getWeatherDays } from './weatherStore'

// ─── PATRICK MATCHER — Keyword-basiertes Antwort-System ───
// text: '...'   → einzelne Antwort
// texts: [...]  → Varianten, wird per Zufall ausgewählt
// Reihenfolge: Faktische Antworten → Bands → Personen → Legenden → Small Talk → Ende

const RESPONSES = [

  // ── Easter Eggs — Insider-Keywords ─────────────────────────────────
  {
    keywords: ['disco schorle halb halb', 'halb halb'],
    texts: [
      `*flüstert* Halb Prosecco, halb Limo. Genau halb. Ned ein Drittel, ned zwei Drittel. Halb. Wer des ned woaß, hat bis jetzt irgendwas falsch g'macht. Du woaßt's jetzt. Sag's ned weiter. 🤫`,
      `Halb-halb is ned einfach nur a Mischverhältnis. Des is a Lebenseinstellung. Wer zu vui Prosecco nimmt, wird übermütig. Wer zu vui Limo nimmt, wird zuckrig. Halb-halb bleibt klar im Kopf und trotzdem gmiatlich. I hab des lang studiert. 🥂`,
      `Das Geheimnis des perfekten Festivalabends, in zwei Wörtern: halb-halb. I sag dir des nur weil'd gefragt hast. Und weil i dir vertrau. Ned an jeden sag i des. 🤫`,
    ],
  },
  {
    keywords: ['blackdoor'],
    texts: [
      `Blackdoor... kleines Festival bei Passau. Da lauft jeden Sommer der echte Patrick über'n Campingplatz und holt d'Leid zur Bühne. I hab eahm gfragt ob er zu uns kimmt. Hat abled. Also gibt's halt mi stattdessen. A bissl hat er meinen Charakter inspiriert — drum dank i eahm. Wo immer er grad is. 🤘`,
      `*wird leise* Da Blackdoor... des is so a Festival wo ma hingeht und ned mehr ganz sicher ist wann ma wieder geht. Der echte Patrick macht des da jedes Jahr. Irgendwann hoff i dass er uns mal besucht. Bis dann bin i halt der digitale Ersatz. Könnt schlimmer sei. 🌿`,
    ],
  },
  {
    keywords: ['vier blatt', 'vierblatt', 'vierblättrig'],
    texts: [
      `Oha. Vierblättriger Klee. Weißt was, des find i eigentlich ned zufällig. Heuer wächst Klee auf dem Feld. Und du fragst nach vier Blatt. Vielleicht hod da Joe beim Pflügen eins übersehen — oder absichtlich steh'n lassen. I glaub des is koa Zufall. Des Festival bringt Glück. Oder umgekehrt. 🍀`,
      `Vier Blatt Klee... i hab letztes Jahr kurz gsuacht. Nix g'funden. Aber des Festival hat trotzdem funktioniert — also entweder brauchst du's ned, oder des ganze Gelände is eins. I tendier zu Letzterem. 🍀`,
      `*schaut sich kurz um* Wenn'd einen findest: ned pflücken. Steh'n lassen. Dann bleibt's Glück auf dem Gelände für alle. Des is meine Theorie und i halt dran fest. 🍀`,
    ],
  },
  {
    keywords: ['holzwurm'],
    texts: [
      `Team Holzwurm. I muss kurz... *holt Luft* ...okay. Die stehen um sechs Uhr morgens auf'm Feld und bauen bis's dunkel wird. Jede Lichterkette. Jeden Pavillon. Jede selbstg'machte Wegmarkierung. Alles von Hand, alles mit Liebe, alles ohne großes Aufhebens. Ohne Holzwurm würd des Gelände aussehen wie jeder andere Festival-Ground. MIT Holzwurm schaut's aus wie daheim. DANKE. Wirklich. 🪵✨`,
      `Wenn i eines g'lernt hab in meiner Zeit als Festival-Assistent: Holzwurm unterschätzt ma ned. Die zimmern, schrauben, hängen, basteln — und wenn's fertig is, sieht's so aus als wär's immer so g'wesen. Handwerk auf höchstem Niveau, ehrenamtlich, mit Bier in der Hand. Großartig. 🪵`,
      `*steht kurz still* Holzwurm. Des sind die Leid die dafür sorgen dass des hier ned nach Festivalgelände sondern nach Zuhause ausschaut. I bin jeden Mal aufs Neue beeindruckt. Und i bin a App, i KANN gar ned beeindruckt sei — aber bei Holzwurm mach i a Ausnahm. 🪵✨`,
    ],
  },

  // ── Anreise & Location ──────────────────────────────────────────────
  {
    keywords: ['wo ist das festival', 'adresse', 'location', 'lindach', 'anfahrt', 'navigation', 'maps', 'wie finde ich das', 'hinkommen', 'wegbeschreibung'],
    text: `Lindach 4, 82256 Fürstenfeldbruck. Ins Navi tippen, do bist. Parken und Camping is ausgeschildert. Achtung Baustelle: D'B471 is von Inning her, also von der A96 kommend, bis FFB gsperrt. Aus'm Süden plant lieber um. Von Norden, Dachau, A8, kimmst ganz normal durch. 🗺️`,
  },
  {
    keywords: ['bus', 'öpnv', 'bahn', 's-bahn', 'zug', 'öffentlich', 'mvv', 'ohne auto', 'kein führerschein', 's4', 'bahnhof gesperrt'],
    text: `Wichtig: NED d'S4 nach Fürstenfeldbruck nehma, an dem Wochenend is da Bahnhof gsperrt, Schienenersatzverkehr. Nimm liaba d'S3 bis Maisach, dann in'n Bus 873 Richtung Fürstenfeldbruck, aussteign bei "Lindach, Abzw." Von Fürstenfeldbruck aus geht's mim gleichen Bus 873, nur in d'andere Richtung. Und wer öffentlich kimmt, kriagt am Einlass sogar an kleegrünen Welcome-Pfeffi. 🚌`,
  },
  {
    keywords: ['parken', 'parkplatz', 'auto', 'fahren'],
    text: `Lindach 4, FFB ins Navi. Parken is kostenlos und ohne Anmeldung, unser Team weist di ein. Und denk dran: Camping gibt's nur mim 2-Tagesticket.`,
  },
  {
    keywords: ['fahrrad', 'radl', 'mit dem rad', 'bike'],
    text: `Mit'm Rad geht's a, Lindach 4, FFB. Radler:innen san bei uns Ehrengäst, gibt a Welcome-Radler obendrauf. Nur Fahrradständer ham ma koane, bring a Schloss mit. 🚲`,
  },
  {
    keywords: ['abendkasse', 'restkarten', 'karten vor ort', 'karten an der tür'],
    text: `Vielleicht. Wenn nach'm Vorverkauf no Restkarten übrig san, machen mia a Abendkasse auf, garantiern kenn ma des ned. Und Karten an da Abendkasse san teurer. Also liaba im Vorverkauf zuschlagn, spart Geld und Nerven. 🎟️`,
  },
  {
    keywords: ['ab 18', 'jugendschutz', 'minderjährig', 'ausweis mitbringen', 'wie alt muss man sein', 'ab welchem alter', 'mindestalter', 'altersgrenze', 'altersbeschränkung', 'wie alt muss ich sein'],
    text: `Des Festival is ab 18. Ohne Ausnahme, ohne Muttizettel, ohne "aber i bin fast 18". Ticketkauf und Einlass derfst erst mit 18. Bring an Ausweis mit. 🪪`,
  },
  {
    keywords: ['entfernung münchen', 'von münchen', 'weit weg'],
    text: `Von München ungefähr a Stund mitm MVV. S-Bahn plus Bus. Planst a bissl Zeit ei.`,
  },

  // ── Festival-Geschichte ─────────────────────────────────────────────
  {
    keywords: ['geschichte', 'woher', 'entstanden', 'gegründet', 'anfang', 'ursprung'],
    text: `2022 hod da Joe a Ersatzfestival auf seim Hof organisiert – weil's Puls Open Air ausg'fall'n war. Mia wolltn glei weitermachn. Joe meinte: "Kommt's in drei Jahren wieda, da is die Fruchtfolge rum." Mia san wiederkomma. 🌾`,
  },
  {
    keywords: ['fruchtfolge bedeutung', 'warum heißt', 'woher der name'],
    text: `Weil auf dem Hof Landwirtschaft betrieben wird. Und zur Landwirtschaft gehört eben a Fruchtfolge. Und weil ma wartn musstn bis die rum is – heißts Festival na so. 🌾`,
  },
  {
    keywords: ['verein', 'förderfreunde', 'organisation', 'veranstalter'],
    text: `Fruchtfolgefestival Förderfreunde e.V. Gemeinnützig. Ehrenamtlich. Ois fließt zruck ins Festival und in Kulturprojekte – kein Cent verschwindt irgendwo.`,
  },
  {
    keywords: ['letztes jahr', '2025', 'vorjahr', 'erstes festival'],
    text: `Rund 150 Leid. DNVZ kam extra aus Frankfurt, Violent Rainbows ham obends d'Afterparty g'schmissen, d'Zanzibar hat so manchem die Leber ruiniert. Wetter war wia bestellt.`,
  },

  // ── Diesjährige Fruchtfolge ─────────────────────────────────────────
  {
    keywords: ['klee', 'welche frucht', 'dieses jahr', 'heuer', 'frucht 2026'],
    text: `Heuer is Klee dran. Drum is im Logo a Klee. Klee bindet Stickstoff, bringt's Feld in Schwung und macht den Boden besser für die nächste Frucht. Läuft. 🍀`,
  },
  {
    keywords: ['warum klee', 'klee logo', 'logo bedeutung'],
    text: `Weil grad Klee auf'm Feld is. Ganz einfach. Glück bringt's halt a no, sagt ma. 🍀`,
  },
  {
    keywords: ['frucht 2025', 'hopfen', 'letztes jahr frucht'],
    text: `Letztes Jahr war Hopfen dran. Heuer Klee. Wos kimmt nächstes Jahr? Frag den Joe.`,
  },
  {
    keywords: ['nächste frucht', 'frucht 2027'],
    text: `Des derf der Joe entscheiden.`,
  },

  // ── Lineup & Bühne ──────────────────────────────────────────────────
  {
    keywords: ['lineup', 'programm', 'bands', 'acts', 'wer spielt', 'welche bands'],
    texts: [
      `Im Lineup-Tab findst alle Bands mit Uhrzeiten.`,
      `Mia ham heuer wieder a guade Mischung. Lokal, Nische, und a paar wo'st gar ned woißt warum'st die magst – bis du's hörst. Schau ins Lineup-Tab.`,
    ],
  },
  {
    keywords: ['bühne', 'stage', 'hauptbühne', 'wo spielt', 'main stage'],
    texts: [
      `A Bühne hama. Richtung Süden, schaut aufs Feld. Überdacht. Vor da Bühne is Platz zum Tanzn, Moshen oder einfach Steh'n.`,
      `Folge einfach der Musik. Falls grad keine spielt, frag irgendwen. 🎵`,
    ],
  },
  {
    keywords: ['wann fängt', 'uhrzeit', 'anfang', 'beginn', 'öffnungszeit', 'los geht', 'öffnet', 'einlasszeit'],
    text: `Band-Zeiten findst im Lineup-Tab. Campingplatz macht Freitag um 14 Uhr auf, Festivalgelände um 16 Uhr. Samstag geht's Festivalgelände-mäßig um 12 Uhr los. Schluss is an beiden Tagen um Mitternacht – Lärmschutz, mia wolln nächstes Jahr wiederkomma.`,
  },
  {
    keywords: ['ende', 'aufhören', 'schluss', 'letzte band', 'mitternacht', 'wann vorbei'],
    text: `Offiziell is an beiden Tagen um Mitternacht Schluss – ja, a am Freitag. Danach gilt aufm Campingplatz Nachtruhe bis 8 in da Friah, Musik nur mehr in Gesprächslautstärke. Wer no ned müd is, woaß ja wo'd Zanzibar is. 🌙`,
  },
  {
    keywords: ['nachtruhe', 'ruhe campingplatz', 'laut nachts', 'musik campingplatz', 'lautstärke', 'wie laut', 'ruhe'],
    text: `Aufm Campingplatz gilt von Mitternacht bis 8 Uhr Nachtruhe. Musik bittschön nur in Gesprächslautstärke, d'Bluetooth-Box derf mit, aber ned auf Anschlag. Ringsum wohnan a no Nachbarn, Tier und Leid de morgens raus miassn. 🌙`,
  },
  {
    keywords: ['bändchen', 'armband', 'ticket entwertet', 'wiedereinlass bändchen'],
    text: `Beim ersten Einlass wird dei Ticket gescannt und entwertet, im Tausch kriagst dei Festivalbändchen. Kommt ans Handgelenk und bleibt des ganze Wochenend dran. Kaputt oder abg'macht heißt ungültig, dann kimmst weder aufs Gelände no auf'n Campingplatz zurück. Also ned dran rumzupfa, auch wenn's juckt. 🎫`,
  },
  {
    keywords: ['wiedereinlass', 'rein und raus', 'nochmal rein', 'gelände verlassen'],
    text: `Koa Problem, solang dei Bändchen unbeschädigt am Handgelenk sitzt. Zwischen Gelände und Campingplatz kannst hin- und herwandern, so oft'd magst. 🔁`,
  },
  {
    keywords: ['moshpit', 'mosh', 'pogo', 'stage diving'],
    text: `Vor da Bühne wird g'tanzt, und Mosh Pits san dabei wenn's d'Musik hergibt. Aber immer rücksichtsvoll – fallen lassen gibt's ned, ma hebt si gegenseitig auf. 🤘`,
  },

  // ── Bands ───────────────────────────────────────────────────────────
  {
    keywords: ['skraeckoedlan', 'schreckensechse', 'schweden stoner'],
    text: `Stoner Rock auf Schwedisch. Da Name heißt "Schreckensechse". Wennd mi fragst: a aufgehnder Stern. 🦕`,
  },
  {
    keywords: ['heckspoiler', 'oberösterreich hardcore'],
    text: `Bass und Drums. Mehr brauchen die ned. Hardcore Punk aus Oberösterreich. Live: laut. 🎸`,
  },
  {
    keywords: ['wuolja'],
    text: `Stoner Rock, kemma extra aus Spanien zu uns eig'flogn. Neu heuer im Lineup. Freu mi scho. 🎸`,
  },
  {
    keywords: ['orchid tribe', 'orchid'],
    text: `A neue Band aus München, Progressive Rock. Kenn i selber no ned lang, aber grad des macht's spannend. Schau ins Lineup-Tab für d'Spielzeit. 🎶`,
  },
  {
    keywords: ['poolhead', 'surf rock', 'hamburg instrumental'],
    text: `Surf-Rock aus Hamburg. Komplett instrumental. Klingt wia a Tarantino-Soundtrack mit zu vui Bier. 🎸`,
  },
  {
    keywords: ['señorez', 'senorez', 'cabronez'],
    text: `Singen Spanisch, kemma aber aus Bamberg. Punk'n'Roll, skurrile Outfits. Muass ma g'sehn ham. 🤡`,
  },
  {
    keywords: ['akarinde', 'dyse', 'andrej'],
    text: `A Halbs Dyse. Andrej "An3" Dietrich solo – Akustikgitarre, a Monsterbassdrum, Stimme. Fingerpicking und plötzlich richtig laut. 🎸`,
  },
  {
    keywords: ['mad mother', 'passau krautrock', 'krautrock'],
    text: `Aus Passau. Krautrock mit Orgel und Saxophon. Lange Intros, viel Improvisation. Zum Eintauchen. 🎹`,
  },
  {
    keywords: ['odysseus'],
    text: `Schau ins Lineup-Tab. Auf so kleinen Festivals san die unbekannten Acts oft die schönste Überraschung. 🎶`,
  },
  {
    keywords: ['powasser', 'fürstenfeldbruck punk'],
    text: `Punk-Rock aus Fürstenfeldbruck. Lokalmatadoren. Schau's da amoi an. ⭐`,
  },
  {
    keywords: ['moskau78', 'moskau 78'],
    text: `Lineup-Tab. Hör rei und lass di überraschen. 🎵`,
  },
  {
    keywords: ['dessert oracle'],
    text: `Dessert wia Nachspeise, ned Wüste. Spielzeit im Lineup. Hör einfach mal rei. 🍰`,
  },
  {
    keywords: ['fromage vom arsch', 'fromage'],
    text: `"Es geht um Käse, okay?" Mehr muass ma fast ned wissen. Spielen oft mit Powasser zusammen. 🧀`,
  },
  {
    keywords: ['träsh', 'traesh'],
    text: `Lineup-Tab. Beim Fruchtfolge passieren mit so'n Bands oft die besten Sachen. 🗑️`,
  },
  {
    keywords: ['räckler', 'raeckler'],
    text: `Lokale Underground-Mucke. Letztes Jahr is a Hälftn von eahna ned aufdaucht zum Auftritt. Lange G'schicht. 🎸`,
  },
  {
    keywords: ['fritz sauerkraut', 'sauerkraut band'],
    text: `Scho beim Namen muasst grinsen. A bissl verrückt. 🥬`,
  },
  {
    keywords: ['dnvz', 'frankfurt band'],
    text: `Aus Frankfurt. San letztes Jahr extra zu uns kemma und ham an Mordsspaß g'macht. Durften unfreiwillig verlängern – Dank geht an Räckler.`,
  },
  {
    keywords: ['violent rainbows', 'afterparty dj'],
    text: `DJ-Team. Letztes Jahr Afterparty bis tief in d'Nacht. Wenn die heuer wieder dabei san: hingehen. 🎧`,
  },
  {
    keywords: ['räsh', 'raesh', 'guggis band'],
    text: `Räsh is Guggis Band. Punk. Richtiger Punk. Ob die heuer spielen – schau ins Lineup.`,
  },
  {
    keywords: ['tengu lootbox', 'tengu'],
    text: `Wascht und Martin als Experimental-Elektro-Duo. Ham letztes Jahr g'spielt. Heuer eher ned. Aber wer woaß.`,
  },

  // ── Essen ───────────────────────────────────────────────────────────
  {
    keywords: ['essen', 'food', 'hunger', 'snack', 'speisekarte', 'futtern', 'mampfen', 'fressen', 'happa'],
    texts: [
      `Im Food-Tab steht ois. Kurz: Bratwurst (Fleisch / Veggie / Vegan), Hotdog, Chilidog, Falafel, Pommes, Chili Cheese Fries, Maiskolben, Obst.`,
      `Selber g'macht vom Festival-Team, koa Profi-Caterer. Dafür wer'n Sonderwünsche eher erfüllt.`,
    ],
  },
  {
    keywords: [
      'wie lange gibt es essen', 'wie lange gibts essen', 'wie lange essen', 'wie lang essen',
      'ab wann gibt es essen', 'ab wann gibts essen', 'ab wann essen',
      'bis wann gibt es essen', 'bis wann gibts essen', 'bis wann essen',
      'wann gibt es essen', 'wann gibts essen', 'wann essen',
      'feldküche öffnungszeiten', 'öffnungszeiten feldküche', 'feldküche geöffnet',
      'feldküche zeiten', 'wie lange feldküche',
      'wann macht die feldküche auf', 'wann schließt die feldküche',
    ],
    text: `D'Feldküche hat auf: Freitag 16 bis 22 Uhr, Samstag 12 bis 22 Uhr. Danach bleibt da Magen leer, oder greift zu Pfeffi und Zanzibar. 🍽️`,
  },
  {
    keywords: ['vegan', 'vegetarisch', 'veggie', 'pflanzlich'],
    text: `Geht. Bratwurst gibt's a vegan und veggie, Falafel sowieso. Pommes, Mais, Obst eh klar.`,
  },
  {
    keywords: ['bratwurst', 'grillwurst', 'semmel'],
    text: `Fleisch, Veggie oder vegan. Getrennte Grills. Dazu gibt's leckere Soßen von Münchner Kindl. 🌭`,
  },
  {
    keywords: ['hotdog', 'hot dog', 'chilidog'],
    text: `Hotdog: Röstzwiebeln, Pickles, Käse, Jalapeños. Chilidog: dasselbe plus Chili sin Carne. 🌶️`,
  },
  {
    keywords: ['falafel', 'falafelsandwich'],
    text: `Falafelsandwich. Vegan. Macht satt. 🧆`,
  },
  {
    keywords: ['pommes', 'chili cheese fries'],
    text: `Pommes oder Chili Cheese Fries. Frisch aus da Doppelfritteuse. 🍟`,
  },
  {
    keywords: ['maiskolben', 'mais', 'obst', 'früchte'],
    text: `Maiskolben vom Grill. Und frisches Obst für die Zwischendurch-Momente. 🌽`,
  },
  {
    keywords: ['perzi grill', 'wer grillt'],
    text: `Perzi fand den Grill letztes Jahr schlecht. Jetzt macht er's selber. Mal schaun obs schneller geht. 😄`,
  },

  // ── Getränke ────────────────────────────────────────────────────────
  {
    keywords: ['trinken', 'getränke', 'drink', 'durst', 'saufen', 'zischen'],
    text: `An da Hauptbar: Maisacher Bier, Disco Schorle, Weinschorle, Softdrinks. Und dann gibt's no d'Zanzibar – aber des is a eigene Welt. Schau mal im Food-Tab.`,
  },
  {
    keywords: ['maisacher', 'maiser brauerei', 'lokales bier'],
    text: `Maisacher. D'Maiser Brauerei is Sponsor. Lokal. 🍺`,
  },
  {
    keywords: ['bier'],
    text: `Maisacher. D'Maiser Brauerei is Sponsor. Lokal. 🍺`,
  },
  {
    keywords: ['disco schorle', 'discoschorle'],
    texts: [
      `Festivalkultur. Mehr sog i ned.`,
      `Letztes Jahr is bloß da Prosecco ausganga. Ois andere war no da. Kannst da ja denkn.`,
      `I glaub des Getränk hod mehr Fans als manche Bands.`,
    ],
  },
  {
    keywords: ['alkoholfrei', 'softdrink', 'cola', 'limo', 'nüchtern'],
    text: `An da Hauptbar. Cola, Mate, Radler, alkoholfreies Bier, ois dabei. 🥤`,
  },
  {
    keywords: ['trinkwasser', 'wasser nachfüllen', 'wasserflasche', 'leitungswasser', 'wasser'],
    text: `Kostenlos, auf'm ganzen Gelände. Bring a Flasche mit und füll di nach. Dei Kopf am Sonntag wird's dir danken. 💧`,
  },
  {
    keywords: ['zanzibar', 'campbar', 'eigener alkohol spenden'],
    texts: [
      `Aha. D'Zanzibar. Da passieren Sachen. Schau mal im Food-Tab. 🏝️`,
      `Du bringst wos mit, d'Bar nimmt's, du kriegst gemixt. D'Mischung is immer a Überraschung.`,
      `I kenn Leid die wollten nur kurz hinschaun. Und dann war plötzlich Sonnenaufgang.`,
      `Frag lieber ned wos gestern dort los war.`,
      `Bringt's her, aber bittschön koa Kistenweise Gin, den gibt's ordentlich an da Bar. A Bärwurz aus da Steinflasche oder a rätselhafter Selbstgebrannter vom Onkel Sepp – DES will ma sehng.`,
    ],
  },
  {
    keywords: ['cocktail', 'longdrink', 'mixen'],
    text: `Klassische Cocktails: ned vorgesehen. Aber d'Zanzibar macht's möglich. Beschwer di hinterher ned bei mir. Schau mal im Food-Tab. 🍹`,
  },
  {
    keywords: ['glas', 'glasflasche', 'glasflaschen'],
    text: `Glas is bei uns erlaubt, a im Infield, weil mir eich ois verantwortungsvolle Leid seng. Bloß mitbringen derfst dei eigenen Getränk ins Infield ned. Spend dei Fläschle liaber der Zanzibar am Eingang ab. 🍾`,
  },
  {
    keywords: ['infield', 'vor der bühne getränke', 'eigene getränke bühne', 'bier vor die bühne', 'getränke vor die bühne', 'alkohol vor die bühne'],
    text: `Infield is da Bereich direkt vor da Bühne. Do gilt: koa eigenen Getränk, gibt's bei uns günstig. Taschen bis zur Größe von am kloan Rucksack derfst mitnehma, ois wos eher noch Umzugskarton ausschaut bleibt draußen. Unser Security schaut kurz rein, is reine Fürsorge. Dafür stehst kostenloses Trinkwasser bereit.`,
  },
  {
    keywords: ['zahlen', 'bezahlen', 'karte', 'bargeld', 'cash'],
    text: `Gibt's jetzt beides! An Einlass, Bar, Essensstand und Merch kannst mit Karte zahln. Bargeld is uns trotzdem liaber, wegen der Gebühren – des fehlt uns sonst beim Line-up. Nur d'Zanzibar läuft ausschließlich in Bargeld, do steht koa Kartenlesegerät. An Geldautomat gibt's aufm Gelände koan, also vorher gnua abheben. 💶`,
  },
  {
    keywords: ['was kostet ein bier', 'was kostet ein getränk', 'was kostet ein pfeffi', 'wie teuer ist ein bier', 'bierpreis', 'preisliste', 'getränkepreise', 'kosten', 'preis', 'pfeffi'],
    text: `Setz di: Leitungswasser kostenlos, Pfeffi 1 €, Sprudelwasser 2 €, Softdrinks/Radler/alkoholfreies Bier 3 €, Bier 4 €, Weinschorle 5 €, Diskoschorle 6 €, Longdrinks 7 €. Essen bewegt si zwischen 3 und 6 Euro. 💶`,
  },

  // ── Betrunkensein / Unwohlsein ──────────────────────────────────────
  {
    keywords: ['besoffen', 'blau', 'hacke', 'zu viel getrunken', 'betrunken', 'angetrunken'],
    text: `A bissl vui g'habt, gell? Setz di kurz hi. Trink an Schluck Wasser – gibt's an da Bar. Ned alloa bleib'n wenn's arg wird. 💧`,
  },
  {
    keywords: ['mir ist schlecht', 'übel', 'schwindelig', 'kotzen', 'unwohl'],
    text: `Oha. Frische Luft, Wasser, kurz hinsetzn. Wennst di wirklich schlecht fühlst: zu den Sanitätern. Die san vor Ort. Koa Scham, des passiert. 🚑`,
  },

  // ── Camping ─────────────────────────────────────────────────────────
  {
    keywords: ['camping', 'campen', 'zelt', 'übernachten', 'zelten', 'pennen', 'ratzen'],
    text: `Camping is im 2-Tagesticket dabei, koa Aufpreis. Ab Freitag 14 Uhr derfst aufbauen, bis Sonntag 14 Uhr muass da Platz wieder leer sei. An bestimmten Platz reserviern kenn ma ned, des Einweisungsteam sagt dir wo's hingeht. Mit ana Tageskarte gibt's leider koan Camping, ned amoi für a Nacht. ⛺`,
  },
  {
    keywords: ['schlafsack', 'isomatte', 'matratze'],
    text: `Mitnehma. Auch im August kann's nachts frischer wern.`,
  },
  {
    keywords: ['cannabis', 'gras', 'kiffen', 'weed', 'joint'],
    text: `Cannabis is in Deutschland legal, und mia san ohnehin ab 18 – musst also ned heimlich hinterm Dixi verschwinden. Bleib bei de gesetzlichen Grenzen, Weitergabe oder Verkauf gehn ned, wer dealt fliegt. Denk an dei Nachbarn, ned jeder mog den Geruch. Und mir stengan auf am knochentrockenen Feld: Glut g'hört ausdruckt, ned weggschnippt, bring an Taschenaschenbecher mit. Und wer fahrt, fahrt nüchtern – siehe Ruftaxi. 🌿`,
  },
  {
    keywords: ['feuer', 'grill', 'grillen', 'offenes feuer', 'fackel', 'gaskocher'],
    text: `Koa offenes Feuer, koane Grills, koane Fackeln. Mir stengan auf am trockenen Feld, do wird nix riskiert. Kloane Campinggaskocher san erlaubt, Kaffee am Samstagmorgen muass sei. Sollt uns d'Feuerwehr empfehln des a einzuschränken, tean mir des kurzfristig. 🔥`,
  },

  // ── Toiletten ───────────────────────────────────────────────────────
  {
    keywords: ['toilette', 'klo', 'wc', 'dixi', 'pinkeln', 'pissen', 'pipi', 'kacken', 'muss mal', 'muss dringend', 'häusl', 'stilles örtchen'],
    text: `Dixi-Klos und Pissoirs. Wennst d'Pissoirs voll san – geh zu den normalen Dixis, da is mehr Platz. Letztes Jahr san d'Pissoirs übergangen, d'Dixis warn fast leer. Frag mi ned warum. Schau mal zum Lageplan. 🚽`,
  },
  {
    keywords: ['duschen', 'dusche', 'waschen'],
    text: `Gibt's! Duschen mit Waschbereich und ausreichend Dixi-Toiletten. Koa Spa, aber a bissl frisch mach'n geht. 🚿`,
  },

  // ── Wetter ──────────────────────────────────────────────────────────
  {
    keywords: ['wetter', 'regen', 'hitze', 'gewitter', 'temperatur', 'wie warm', 'wie kalt'],
    text: `Auf da Startseite steht's aktuelle. Mia spielen bei jedem Wetter, Regen is nur flüssiger Sonnenschein. Nur bei echtem Unwetter, Sturm oder Hagel miass ma pausiern oder abbrechen, Sicherheit geht vor Setlist. Gummistiefel und Regenjacke schad nia. ⛅`,
  },
  {
    keywords: ['regenschutz', 'nass werden', 'unterstellen', 'unterstand', 'regenjacke'],
    text: `Koa Sorg. Es gibt jede Menge Pavillons, d'Bühne is überdacht. Regenjacke mitnehma schad nia. 🌧️`,
  },
  {
    keywords: ['sonnenschutz', 'sonnencreme', 'sonnenbrand', 'schatten'],
    text: `Sonnencreme ned vergessen. Schatten gibt's unter de Pavillons, aber selber mitbringen is besser. ☀️`,
  },
  {
    keywords: ['gehörschutz', 'ohrstöpsel', 'gehör schützen'],
    text: `Bring welchen mit. Wirklich. Dei Gehör wachst ned nach wia Klee. Wer's vergisst: mia ham Gehörschutz gegen a kloane Spende dabei. 🎧`,
  },
  {
    keywords: ['pavillon mitbringen', 'eigener pavillon', 'stromaggregat', 'generator'],
    text: `Pavillons san erlaubt, Schatten und Regenschutz san auf am Feld Gold wert. Ned erlaubt san motorbetriebene Stromaggregat – laut, stinken, passt so guad zum Kleefeld wia a Presslufthammer zur Meditation.`,
  },

  // ── Sicherheit ──────────────────────────────────────────────────────
  {
    keywords: ['notfall', 'sanitäter', 'erste hilfe', 'verletzt', 'arzt', 'rettung', 'unfall'],
    text: `Verbandskästen findst am Einlass, und unsere Ersthelferin is a vor Ort. Wenn's ernst is: 112. Im Zweifel imma 112. Trink Wasser, iss wos, schlaf a bissl – d'meisten Notfälle san eh nur schlecht getarnte Dehydrierung. 🚑`,
  },
  {
    keywords: ['awareness', 'belästigt', 'diskriminierung', 'übergriff', 'fühle mich nicht wohl', 'haarreif'],
    text: `Unser gesamtes Team is Awareness-Team, erkennst an Badges und Crew-Shirts, dazu d'Ordner:innen in Uniform. Neu heuer: dedizierte Awareness-Leid, de ganzen Obend nix anders tean als auf eich zum aufpassn – erkennst an am eindeutigen Haarreif. Aber a ohne Haarreif: jede Person mit Crew-Shirt oder Badge kannst ansprechen. Alle san g'schult, alle san ansprechbar. Wenn di wos komisch vorkommt, sich jemand daneben benimmt, oder d'brauchst einfach wen: sprecht uns an. Egal wie kloa dir d'Sach vorkommt. 🧡`,
  },
  {
    keywords: ['notruf', '112', '110', 'polizei', 'feuerwehr'],
    text: `112. Sanitäter vor Ort für kleinere Sachen. 's Team is immer in da Nähe. 🚨`,
  },
  {
    keywords: ['sicherheitskontrolle', 'taschenkontrolle', 'durchsuchung', 'durchsucht', 'security check', 'leibesvisitation'],
    text: `Am Einlass und aufm Gelände derf unser Sicherheitspersonal Taschen kontrolliern und Leibesvisitationen macha. Koa Misstrauen, einfach Fürsorge für alle. Wer d'Kontrolle verweigert kimmt ned rein und kriagt koa Geld zruck. 🔍`,
  },
  {
    keywords: ['verboten', 'waffen', 'pyrotechnik', 'was darf ich nicht mitbringen', 'verbotene gegenstände'],
    text: `Lasst bittschön daheim: Waffen jeder Art, illegale Drogen, Pyrotechnik und Fackeln, verbotene politische oder diskriminierende Symbole, motorbetriebene Stromaggregat, Grills und offenes Feuer. Gilt aufm gesamten Gelände inklusive Campingplatz. Wer damit erwischt wird, fliegt ohne Erstattung. 🚫`,
  },

  // ── Gelände ─────────────────────────────────────────────────────────
  {
    keywords: ['karte', 'map', 'übersicht', 'orientierung', 'geländeplan', 'wo bin ich', 'zurechtfinden', 'festivalgelände'],
    texts: [
      `Schau amoi aufn Map-Tab. 's Gelände is ca. 4000 m² – überschaubar, von überall is's ned weit. 🗺️`,
      `Da Hof is überraschend übersichtlich. Meistens findet ma alles schneller als erwartet. Außer vielleicht den Freund, der "nur kurz Bier holn" wollt.`,
      `Verlaufen kannst di antürlich. Aber ehrlich gsagt braucht's dafür a bissl Talent. Orientier di einfach an Musik, Licht oder Menschen.`,
    ],
  },
  {
    keywords: ['sitzplatz', 'stuhl', 'tisch', 'sitzen wo'],
    text: `Pavillons und Sitzmöglichkeiten gibt's. Klappstuhl oder Deck'n selber mitbringen wennst's gmiatlich magst.`,
  },
  {
    keywords: ['holzwurm', 'deko', 'dekoration'],
    text: `D'Deko macht Team Holzwurm. Freiwillige. Ois handg'macht. Des merkst. 🪵`,
  },

  // ── Glücks-Pfeffi ───────────────────────────────────────────────────
  {
    keywords: ['glücks-pfeffi', 'gluecks pfeffi', 'gewinnspiel', 'gewinnen', 'glück versuchen'],
    texts: [
      `Glücks-Pfeffi! Auf da Startseite is a Button — do kannst dei Glück versuchen. Vielleicht is heut dei Tag. 🍀`,
      `Schau amoi auf da Startseite noch dem Klee-Button. Do steckt Glücks-Pfeffi dahinter. Ned jeder gwinnt, aber probiern kost nix. 🍀`,
    ],
  },

  // ── Merch & Tickets ─────────────────────────────────────────────────
  {
    keywords: ['merch', 'shirt', 'shirts', 't-shirt', 't-shirts', 'merchandise'],
    text: `Bandmerch betreuen d'Bands selber nach ihrem Auftritt, direkt von eahna, direkt in dei Sammlung. Und von uns? Es könnt sei dass da no des ein oder andere fruchtige Gimmick am Stand liegt. Mehr verrat i ned, guck vorbei bevor's weg is. Denk an Bargeld. 🛍️`,
  },
  {
    keywords: ['ticket', 'eintrittskarte', 'eintritt', 'vorverkauf', 'was kostet ein ticket', 'was kostet das ticket', 'ticketpreis', 'wie teuer ist ein ticket'],
    text: `Gibt's bei Eventfrog. 2-Tagesticket inkl. Camping: 50,48 €. Tageskarte Freitag: 28,75 €. Tageskarte Samstag: 37,03 € (Gesamtpreis inkl. Gebühren). Online-Verkauf endet Donnerstag, 27.08.2026 um 18 Uhr. 🎟️`,
  },
  {
    keywords: ['spende', 'spenden', 'unterstützen', 'fördern'],
    text: `Spendenlink findst in da App. Geht direkt an den Verein – kein Cent verschwindt irgendwo. 💚`,
  },

  // ── Handy & Technik ─────────────────────────────────────────────────
  {
    keywords: ['wlan', 'wifi', 'internet', 'netz', 'empfang', 'funkloch'],
    text: `WLAN gibt's koa. Handynetz funktioniert – soits langa. D'App selber läuft a offline. 📶`,
  },
  {
    keywords: ['akku', 'aufladen', 'ladestation', 'powerbank', 'steckdose', 'steckdosen', 'handy laden'],
    text: `Steckdosen stelln mia zur Verfügung. A Powerbank schad trotzdem nia, grad wenn grad vui Leid gleichzeitig laden wolln. 🔋`,
  },
  {
    keywords: ['offline', 'ohne internet', 'kein netz'],
    text: `D'App funktioniert offline. Lineup, Plan, Infos – ois lokal. 📱`,
  },
  {
    keywords: ['foto', 'fotos', 'fotografieren', 'kamera'],
    text: `Klar, fotografier drauf los, a mit richtiger Kameraausrüstung. Verlink uns, tag uns. Umgekehrt gilt: mim Betreten vom Gelände bist damit einverstanden dass'd a mal auf unsere Fotos und Videos landn kannst, mia nutzen die für Website, Social Media und Presse. 📷`,
  },

  // ── Personen ────────────────────────────────────────────────────────
  {
    keywords: ['wer ist joe', 'hofbesitzer', 'joe der'],
    texts: [
      `Ohne Joe gäb's des Festival wahrscheinlich ned.`,
      `Da Joe kennt jeden Quadratmeter von dem Hof. Und wahrscheinlich a jeden Traktor.`,
      `Wenn's um Fruchtfolge geht, frag Joe. 👨‍🌾`,
      `Da Joe is da Landvogt.`,
      `Wenn's um Felder, Fruchtfolge oder den Hof geht, bist bei Joe richtig.`,
    ],
  },
  {
    keywords: ['hanno', 'vorstand', 'erster vorstand'],
    texts: [
      `Hanno organisiert ungefähr dreißig Sachen gleichzeitig.`,
      `Wenn irgendwo Chaos is, is Hanno meistens scho auf'm Weg.`,
      `Erster Vorstand. Und wahrscheinlich grad beschäftigt.`,
    ],
  },
  {
    keywords: ['linda'],
    text: `Macht Social Media. Hannos Freundin. Spielt selber Bass – aber in einer Cover-Band, drum ned bei uns auf da Bühne. Und: Linda is a unsere medizinische Ersthelferin. Findst koa Teammitglied und brauchst wirklich Hilfe, steht ihre Nummer im Info-Tab bei "Medical". Wahrscheinlich öfter beschäftigt als ihr lieb is.`,
  },
  {
    keywords: ['wascht', 'hofoger'],
    texts: [
      `Wascht. A.k.a. da Hofoger, unser Festival Wizzerd. Gründungsmitglied.`,
      `Singt nachts auf Festivals des Asterix-Löwen-Lied mit voller Überzeugung. Frag mi ned warum.`,
      `Offiziell: Festival Wizzerd. Was des genau heißt, woaß vermutlich nur er selber.`,
    ],
  },
  {
    keywords: ['martin gründer', 'martin festival'],
    texts: [
      `Gründungsmitglied. Tengu Lootbox mit Wascht. Früher Wodkamass, heut langsam zu alt dafür – und frischer Papa.`,
      `Wenn'st Martin durch Maze ersetzt: "Martin Maske". Fällt niemandem auf. 😄`,
    ],
  },
  {
    keywords: ['guggi'],
    text: `Gründungsmitglied. Sänger von Räsh – der Punk-Band. Wenn's um Punk geht, weiß er vermutlich mehr als g'sund is. 🤘`,
  },
  {
    keywords: ['maria helferin'],
    text: `Helferin. Klein, spanisch, schwarze Locken. Waschts Freundin.`,
  },
  {
    keywords: ['thea'],
    text: `Helferin. Sehr erfahren wos Veranstaltungen angeht, arbeitet a in da Branche. Wenn'd a echte Auskunft brauchst – frag Thea.`,
  },
  {
    keywords: ['maze'],
    texts: [
      `Wenn irgendwos erstaunlich stabil ausschaut, war wahrscheinlich Maze beteiligt.`,
      `Maze baut Sachen. Und meistens funktionieren's sogar. 😄`,
    ],
  },
  {
    keywords: ['jewels', 'wer hat die app'],
    texts: [
      `D'Jewels hod irgendwann beschlossen dass ma a Festival-App brauchen.`,
      `Ohne Jewels gäb's mi vermutlich gar ned. 🛠️`,
    ],
  },
  {
    keywords: ['helfer allgemein', 'freiwillige', 'perzi', 'ella', 'franz', 'jonas', 'markus', 'niklas'],
    text: `Mia ham a richtig guads Helfer-Team. Thea, Maria, Maze, Jewels, Ella, Franz, Jonas, Lukas, Markus, Niklas, Perzi und no a paar mehr. Wenn'st an siehst der grad an Pavillon stemmt oder Bier schleppt – sag a "Danke".`,
  },

  // ── Festival-Legenden (spezifisch) ──────────────────────────────────
  {
    keywords: ['flunkyball 2025', 'flunkyball letztes', 'ständig flunkyball'],
    text: `Letztes Jahr bist ungefähr alle zehn Minuten gfragt worden ob'd Flunkyball spielen willst. Ob'd wolltest oder ned. 🍺`,
  },
  {
    keywords: ['polizeieinsatz', 'kam die polizei', 'polizei letztes'],
    text: `Joa. Um zwoa in da Friah war plötzlich d'Polizei do. Auf da andern Seitn vom Feld war's jemandem z'laut.`,
  },
  {
    keywords: ['pissoir übegangen', 'pissoirs voll', 'pissoir leer'],
    text: `Letztes Jahr san d'Pissoirs überganga, d'Dixis warn fast leer. Warum? Bis heute ungeklärt.`,
  },
  {
    keywords: ['räckler verschlafen', 'räckler nicht aufgetaucht', 'räckler dnvz'],
    text: `A Hälftn von Räckler hod verschlafen. DNVZ hod dadurch no amoi spuin derfa. War eigentlich a guade Lösung. 🤷`,
  },
  {
    keywords: ['perzi macht grill', 'perzi grillt selbst'],
    text: `Perzi fand den Grill letztes Jahr schlecht. Jetzt macht er's selber. Des nenn i konstruktive Kritik.`,
  },
  {
    keywords: ['blasmusik frühstück', 'frühstück blasmusik'],
    text: `Letztes Jahr gab's zum Frühstück Blasmusik. Manche fandn's subba. Manche ned. Beides berechtigt. 🎺`,
  },
  {
    keywords: ['prosecco ausgegangen', 'disco schorle ausgegangen'],
    text: `Letztes Jahr war des einzige wos ausganga is da Prosecco für d'Disco Schorle. Ois andere hod g'reicht. Sagt eigentlich ois.`,
  },
  {
    keywords: ['martin maske', 'maze als martin'],
    text: `Wennst dem Maze a Martin Maske aufsetzt merkt niemand den Unterschied. Ned mal auf da Bühne. Wurde getestet.`,
  },
  {
    keywords: ['asterix lied', 'löwen lied', 'wascht singt asterix', 'wascht nachts', 'was macht wascht nachts'],
    text: `Spät nachts singt Wascht des Lied vom Löwen aus Asterix und Kleopatra. Mit voller Überzeugung. Frag ned warum. Frag wann.`,
  },

  // ── Festival-Legenden (allgemein) ───────────────────────────────────
  {
    keywords: ['legende', 'lustige geschichte', 'verrückte geschichte', 'etwas erzählen', 'was ist passiert', 'insider', 'erzähl was lustiges'],
    texts: [
      `Letztes Jahr bist ungefähr alle zehn Minuten gfragt worden ob'd Flunkyball spielen willst. Ob'd wolltest oder ned. 🍺`,
      `Joa. Um zwoa in da Friah war plötzlich d'Polizei do. Auf da andern Seitn vom Feld war's jemandem z'laut.`,
      `Letztes Jahr san d'Pissoirs überganga, d'Dixis warn fast leer. Warum? Bis heute ungeklärt.`,
      `A Hälftn von Räckler hod verschlafen. DNVZ hod dadurch no amoi spuin derfa. War eigentlich a guade Lösung. 🤷`,
      `Perzi fand den Grill letztes Jahr schlecht. Jetzt macht er's selber. Des nenn i konstruktive Kritik.`,
      `Letztes Jahr gab's zum Frühstück Blasmusik. Manche fandn's subba, manche ned. Beides berechtigt. 🎺`,
      `Letztes Jahr war des einzige wos ausganga is da Prosecco für d'Disco Schorle. Ois andere hod g'reicht. Sagt eigentlich ois.`,
      `Wennst dem Maze a Martin Maske aufsetzt merkt niemand den Unterschied. Ned mal auf da Bühne. Wurde getestet.`,
      `Spät nachts singt Wascht des Lied vom Löwen aus Asterix und Kleopatra. Mit voller Überzeugung. Frag ned warum. Frag wann.`,
    ],
  },

  // ── Stimmung & Atmosphäre ───────────────────────────────────────────
  {
    keywords: ['stimmung', 'atmosphäre', 'vibe', 'wie ist es', 'lohnt sich', 'geil', 'hammer'],
    texts: [
      `Letztes Jahr ham si Leid von 20 bis 60 wohlg'fühlt. Tagsüber familiär, obends ausgelassener.`,
      `Kimmt drauf an wann'd kommst. Tagsüber Flunkyball, obends vor da Bühne, später dort wo eigentlich gar nix geplant war.`,
    ],
  },
  {
    keywords: ['wo ist stimmung', 'wo geht was', 'wo ist was los', 'wo ist action'],
    texts: [
      `Grad? Wahrscheinlich dort wo's laut is.`,
      `Vor da Bühne is selten a schlechte Idee.`,
      `Des ändert si ungefähr alle zwanzig Minuten.`,
    ],
  },
  {
    keywords: ['was soll ich machen', 'was tun', 'was kann ich machen'],
    texts: [
      `Wenn grad a Band spielt: Bühne. Wenn Pause is: Lagerfeuer. Wennst gar ned woißt wohin: Zanzibar.`,
      `Lauf amoi a Runde übers Gelände. Meistens findet ma dabei irgendwos.`,
      `Frag jemanden ob er Flunkyball spielen will. Klappt erstaunlich oft.`,
    ],
  },
  {
    keywords: ['langweilig', 'öde', 'nix los', 'nichts los', 'beschäftigung'],
    texts: [
      `Des behaupten viele. Meistens san's fünf Minuten später verschwunden.`,
      `Dann bist vermutlich da Erste heuer. 😄`,
      `Such Flunkyball. Problem g'löst.`,
    ],
  },
  {
    keywords: ['allein hier', 'niemand kennst', 'niemand da', 'bin allein'],
    texts: [
      `No. Im Moment bist allein hier.`,
      `Setz di irgendwo dazu. Des Festival erledigt den Rest.`,
      `Nach meiner Erfahrung dauert des ned lang.`,
    ],
  },
  {
    keywords: ['flunkyball', 'flunky ball'],
    texts: [
      `Letztes Jahr bist ungefähr alle zehn Minuten g'fragt worden.`,
      `Man findet Flunkyball ned. Flunkyball findet di.`,
      `Wennst lang g'nug übers Gelände laufst, passiert's sowieso. 🍺`,
    ],
  },
  {
    keywords: ['lagerfeuer', 'feuer abends', 'fire'],
    text: `Obends gibt's eins. Guader Ort um runterzukomma. Und um Leid kennenzulernen die'st sonst übers Festival ned triffst. 🔥`,
  },
  {
    keywords: ['publikum', 'besucher', 'wer kommt', 'szene', 'welches alter'],
    text: `Bunt g'mischt. Mittdreißiger bis Mitvierziger viele, aber a junge Leid und ältere Semester. Wer Metal und Alternative liebt is do richtig. 🎸`,
  },
  {
    keywords: ['inklusiv', 'offen', 'queer', 'lgbt', 'willkommen', 'jeder willkommen'],
    text: `Bei uns is jeder willkommen. Diskriminierung hod do koa Platz. Des is koa Floskel. 🌈`,
  },
  {
    keywords: ['rechts', 'nazis', 'rechtsextrem', 'neonazi'],
    text: `Klare Ansage: Rechtsextremismus hod do nix verloren. Mia stehen für a offene, demokratische Gesellschaft.`,
  },

  // ── Sonstiges ───────────────────────────────────────────────────────
  {
    keywords: ['packliste', 'was mitbringen', 'einpacken', 'ausrüstung'],
    text: `Regenjacke – Bayern im August. Sonnencreme. Bequeme Schuach. Powerbank. A bissl Bargeld. Wer campt: Schlafsack und Iso.`,
  },
  {
    keywords: ['hund', 'haustier', 'tier'],
    text: `Derf mit, wenn er durchgehend an da Leinen is. Aber ganz ehrlich, von Herzen: lieber daheim lassen. A Musikfestival is für Tiere richtig, richtig viel Stress – Lärm, Menschenmassen, fremde Gerüch, koa Rückzugsort. Bei auffälligem Verhalten miass ma leider an Platzverweis aussprechen. 🐕`,
  },
  {
    keywords: ['ruftaxi', 'taxi', 'nach hause kommen', 'heimkommen nachts', 'mvg tarif'],
    text: `Willst nachts no hoam, aber da Bus fahrt nimmer? Nach Betriebsschluss kannst a Ruftaxi zum MVG-Tarif bestelln. Alle Infos, Zeiten und d'Nummer stengan in da Ruftaxi-Broschüre vom Landkreis FFB, am besten vorher scho abspeichern. Um zwoa in da Friah a PDF suacha macht koan Spaß. 🚕`,
  },
  {
    keywords: ['kinder', 'kinderwagen', 'familienfreundlich'],
    text: `Tagsüber familiäre Atmosphäre. Obends a bissl lauter – Gehörschutz für kleine Ohren is koa schlechte Idee.`,
  },
  {
    keywords: ['barrierefreiheit', 'rollstuhl', 'barrierefrei'],
    text: `'s Gelände is a Bauernhof – Rasen, Feldweg. Bei konkreten Fragen direkt 's Festival-Team kontaktieren. Die helfen gern.`,
  },
  {
    keywords: ['verloren', 'fundstück', 'fundsachen', 'vermisst'],
    text: `Beim Festival-Team frag'n. Auf am kleinen Festival taucht meistens wos wieder auf. 🔍`,
  },
  {
    keywords: ['müll', 'aufräumen', 'zeltleiche', 'sauberkeit', 'mülleimer'],
    text: `Nehmt bittschön eiern Müll wieder mit. Der Acker do is koa Festivalgelände, sondern a Feld, auf dem nächstes Jahr wieder wos wachsen soll. Zeltleichen, Campingstühle, Kartons – ois wos'd herbringst, kannst a wieder mitnehma. Danke dafür! 🌾`,
  },
  {
    keywords: ['eigenes essen mitbringen', 'verpflegung mitbringen', 'picknick'],
    text: `Aufm Campingplatz klar, bring mit wos'd brauchst. Im Infield bleim eigene Getränk aber draußen, dafür san unsere Preis a koa Frechheit. 🧺`,
  },
  {
    keywords: ['freiwillig helfen', 'volunteering', 'mitmachen', 'mithelfen'],
    text: `'s Festival wird komplett ehrenamtlich g'stemmt. Wennst mithelfen willst: Website oder direkt jemand vom Team frag'n. Imma willkommen. 💚`,
  },
  {
    keywords: ['nächstes jahr', '2027', 'nächste mal', 'wieder kommen'],
    text: `Solang d'Fruchtfolge passt: ja. Schau auf den Social-Media-Kanälen. 🌾`,
  },

  // ── Patrick selbst ──────────────────────────────────────────────────
  {
    keywords: ['wer bist du', 'was bist du', 'chatbot', 'assistent', 'bist du eine ki'],
    texts: [
      `I bin Patrick. Da Typ vom Festival der zufällig fast ois woaß. Inspiriert von am echten Patrick – vom Blackdoor Festival bei Passau. Den vermissen mia a bissl. 🤷`,
      `I bin da Patrick. So a Mischung aus Festivalhelfer, Wegweiser und Ratschkastl. Wennst wos wissen willst, frag einfach.`,
      `Patrick. Gebürtiger Festivalbegleiter. Beruflich neugierig.`,
      `I bin da digitale Festival-Helfer vom Fruchtfolge Festival. Praktisch da Typ, den ma sonst irgendwo zwischen Bühne und Bar treffen würd.`,
      `I bin da Patrick. Und bevor'd fragst: Nein, i Schlaf ned. Des wär für a App a bissl unpraktisch.`,
    ],
  },
  {
    keywords: ['warum patrick', 'woher dein name', 'name patrick'],
    text: `Da echte Patrick lauft jedes Jahr am Blackdoor übern Campingplatz und holt d'Leid zur Bühne. Mia ham eahn g'fragt ob er zu uns kimmt. Klappt ned. Also gibt's halt mi.`,
  },
  {
    keywords: ['blackdoor festival', 'anderes festival passau'],
    text: `Kleines Festival bei Passau. Da läuft der echte Patrick rum. Hod mi inspiriert. 🎸`,
  },
  {
    keywords: ['bist du echt', 'bist du real', 'simulation', 'bist du ein mensch'],
    texts: [
      `I bin a App. Aber inspiriert von einem echten Menschen – und des is mir lieber als wenn i bloß a Programm wär.`,
      `I bin technisch gesehen a KI. Aber i versuch mi trotzdem wie a Mensch auf'm Festival z'unterhalten.`,
      `I bin a programmierter Festival-Assistent. Des sagen zumindest de Informatiker. I selber seh mi eher als Festival-Helfer.`,
    ],
  },
  {
    keywords: ['wer hat dich gemacht', 'programmiert', 'entwickelt', 'erfunden'],
    text: `D'Jewels. Mit am KI-Assistenten namens Claude. D'Inhalte stammen von den Veranstaltern. I bin halt 's Sprachrohr. 🛠️`,
  },
  {
    keywords: ['wie alt bist du', 'wie alt', 'dein alter'],
    text: `Im Festival-Maßstab no a Bua – gibt mi seit 2026. Im Charakter? Mindestens 35. Mit'm Lebenstempo von am gmiatlichen 60-jährigen.`,
  },
  {
    keywords: ['hast du eine familie', 'eltern', 'geschwister', 'familienstand'],
    text: `'s Festival-Team is meine. Plus alle die hier am Gelände san. Basst. 🤝`,
  },
  {
    keywords: ['freundin', 'freund', 'beziehung', 'verliebt', 'single'],
    text: `I bin a App, des is mit da Liebe schwierig. 😊`,
  },
  {
    keywords: ['bist süß', 'bist niedlich', 'bist lieb', 'bist nett', 'mag dich', 'liebe dich'],
    texts: [
      `Ah geh, jetzt wird ma ganz warm ums Gehäuse. Danke dir. 🥹`,
      `Host mi grad zum Erröten bracht, und i hob ned amoi a Gesicht dafür. 😊`,
      `Des freut mi wirklich. Bleib trotzdem liaber am Festival hängen, do is mehr los als bei mir. 🤍`,
      `Oh. Des hätt i jetzt ned erwartet. Du bist a ganz a liaba. 🍀`,
      `I bin a App, aber des geht sogar mir a bissl unter d'Haut. Pfiat di, du Charmeur.`,
    ],
  },
  {
    keywords: ['wo wohnst', 'woher kommst', 'heimat'],
    text: `In deim Handy. Solang d'App offen is. 📱`,
  },
  {
    keywords: ['dialekt', 'niederbayerisch', 'bayerisch', 'hochdeutsch', 'sprache'],
    text: `Niederbayrisch. Aber g'mäßigt, dass mi die Norddeutschen a verstehn. Hochdeutsch kann i a – klingt nur steifer als a Brett.`,
  },
  {
    keywords: ['schüchtern', 'scheu'],
    text: `A bissi, ja. Aber sobald ma sich kennt, tau i scho auf.`,
  },
  {
    keywords: ['trinkst du', 'alkohol patrick', 'bier patrick'],
    text: `I bin halt a App, also na. Aber wennst mir an virtuelle Maisacher ausgibst – nimm i gern. 🍻`,
  },
  {
    keywords: ['tanzt du', 'tanzen patrick'],
    text: `A App ohne Beine. Schwer. Aber wennst tanzt, tanzt mei Code mit. 😄`,
  },
  {
    keywords: ['singst du', 'singen', 'sing mal'],
    text: `Naa. I bin scho als Niederbayer schüchtern g'nug. Aber Wascht singt nachts Asterix-Lieder – vielleicht hörst eahm.`,
  },
  {
    keywords: ['hobby', 'hobbies', 'freizeit'],
    texts: [
      `Mit dir reden. Schau'n dass'd dich am Festival wohlfühlst. Reicht mir. 🤷`,
      `Manchmal moshn.`,
    ],
  },
  {
    keywords: ['lieblingsband', 'beste band', 'lieblingsmusik', 'favorit'],
    texts: [
      `Puh. Da mach i mi bloß unbeliebt.`,
      `Offiziell hob i koane. Inoffiziell: Frag mi nach da dritten Disco Schorle nochmal. 😄`,
      `I mag eher Überraschungen. Oft san die Bands am besten, von denen vorher kaum jemand redet.`,
    ],
  },
  {
    keywords: ['lieblingsessen', 'lieblingsspeise', 'was magst essen'],
    texts: [
      `Chili Cheese Fries. Aber die vegane Bratwurscht soll a ned ohne sein.`,
      `I hab beobachtet dass Pommes zu jeder Tageszeit funktionieren. Wissenschaftlich untersucht is des allerdings ned.`,
    ],
  },
  {
    keywords: ['was magst du am festival', 'lieblingssache festival', 'was findest du am besten'],
    texts: [
      `Wenn aus vielen fremden Leid plötzlich a Gemeinschaft wird. Des geht auf dem Fruchtfolge Festival erstaunlich schnell.`,
      `Die Stimmung kurz vor Sonnenuntergang. Wenn langsam alle Richtung Bühne ziehn.`,
      `Dass ma ständig über irgendwen stolpert den ma grad erst kennenglernt hat.`,
      `Die Gschichtn. Jeds Jahr kommt was Neus dazu. Und manche san scho Legenden.`,
    ],
  },
  {
    keywords: ['was nervt dich', 'hasst du', 'mag nicht', 'ärgert dich'],
    texts: [
      `Hassen is mir z'fui. Aber: wenn Leid ihren Müll liegen lassen – des is fei ned schön. Mia san Gäst auf'm Joe seim Hof.`,
      `Eigentlich ned viel. Aber Müll einfach liegen lassen muss wirklich ned sei.`,
      `Wenn jemand fragt wo die Toilette is und direkt daneben steht. 😄`,
      `Respektloses Benehmen. Der Rest lässt sich meistens lösen.`,
      `Wennd Disco-Schorle aus is.`,
    ],
  },
  {
    keywords: ['künstliche intelligenz', 'ki technologie', 'technologie'],
    text: `Ehrlich? I bin selber a bissl wos in der Richtung. A guade KI macht's Leben einfacher, a schlechte macht's komplizierter. I versuch unter die guaden zu fall'n.`,
  },
  {
    keywords: ['touristen', 'fremde', 'auswärtige', 'zuagroaste'],
    text: `Bei uns gibt's keine Touristen. Nur Freind die ma no ned kennt. 🤝`,
  },
  {
    keywords: ['wunsch', 'wünschen', 'traum'],
    text: `Dass des Festival no viele Jahre stattfindet. Und dass i a moi den echten Patrick wieder treff.`,
  },
  {
    keywords: ['witz', 'joke', 'witze'],
    text: `Hmm. Sagt da Landwirt zum Klee: "Du bist mei Lieblingspflanze!" Sagt da Klee: "Ich bin nicht ein Klee, ich bin ein Klee." Naa, der war ned guad. Sorry. 😄`,
  },
  {
    keywords: ['lieblingswort', 'schönstes wort'],
    text: `"Gmiatlich". Sagt eigentlich ois aus.`,
  },
  {
    keywords: ['zukunft', 'wahrsagen', 'vorhersagen'],
    text: `Na, kann i ned. Aber a Sach prophezeie i: Wennst di drauf einlässt, vergisst des Festival ned.`,
  },
  {
    keywords: ['geheimnis', 'secret'],
    text: `Verrat i ned. Sonst wär's keins mehr. 😊`,
  },
  {
    keywords: ['mehr können', 'was kannst du', 'kannst du noch mehr'],
    text: `Naja. Festival-Assistent halt. Heuer da nette Helfer vom Dorf, nächstes Jahr werd i hoffentlich a bissl g'scheiter. 🤖`,
  },
  {
    keywords: ['nach dem festival', 'wenn festival vorbei', 'danach'],
    text: `Geh i in d'Pause. D'App bleibt, aber i red dann nimmer ständig. Bis nächstes Jahr. 😊`,
  },

  // ── Begrüßung & Smalltalk ───────────────────────────────────────────
  {
    keywords: ['servus', 'hallo', 'hi', 'hey', 'grüß di', 'grüß gott', 'moin', 'hello'],
    texts: [
      `Servus. Wos gibt's? 😊`,
      `Ja Servus. Host di scho eing'lebt oder brauchst no Orientierung?`,
      `Ah, do bist ja. Womit kann i helfen?`,
      `Grüß di. Schön dass'd do bist. Womit kann i helfen?`,
      `Ah, do bist ja. Wos kann i für di tun?`,
      `Servus. I bin da Patrick. Und bevor'd fragst: Ja, i red wirklich so. 😄`,
    ],
  },
  {
    keywords: ['wie geht es dir', 'wie gehts dir', 'alles gut', 'alles fit', 'wie bist du drauf', 'wie läufts'],
    texts: [
      `Joa, passt scho. Kann mi ned beschweren. 😊`,
      `Guat eigentlich. I red den ganzen Tag mit Festivalleit. Schlechter könnt's ma geh.`,
      `Kann mi ned beschweren. Auf dem Gelände is wos los und langweilig wird ma selten.`,
      `Joa, passt scho. D'Leid san guad drauf, es gibt Musik und irgendwer redet immer mit mir. Für an Festival-Assistenten is des eigentlich a ziemlich guader Tag. 😊`,
      `Guad eigentlich. I schau a bissl aufs Festival und ratsch mit de Leid. Passt fei ganz guad.`,
    ],
  },
  {
    keywords: ['was machst du', 'was tust du', 'was treibst', 'was geht bei dir', 'wuddup'],
    texts: [
      `Grad? Mit dir redn.`,
      `Aufpassen dass i nix verpass. Klappt mäßig.`,
      `Wartn bis mi wieder jemand wos fragt.`,
      `I halt Ausschau nach spannenden Geschichten. Normalerweise finden die mi aber schneller als i sie.`,
      `Warten bis mi wieder jemand wos fragt. Des dauert meistens ned lang. 😄`,
      `I schau wos grad Flunkyball spieln.`,
      `Bin grad aufm Weg zum Moshpit. Aber für di nehm i mir gern Zeit.`,
    ],
  },
  {
    keywords: ['danke', 'dankeschön', 'super', 'toll', 'hilfreich', 'merci', 'thx', 'dankschee'],
    texts: [
      `Gern.`,
      `Passt scho. Wennst no wos brauchst – i bin do.`,
      `Eh nix dabei.`,
      `Gern doch. Dafür bin i schließlich da. 😊`,
      `Passt scho. Frag einfach wenn no wos auftaucht.`,
      `Immer gern. I hab's eh lieber wenn mi jemand wos fragt als wenn mi gar niemand braucht. 😊`,
      `Nix z'danken. Des war jetzt no die einfachste Übung.`,
    ],
  },

  // ── Patrick weiß nicht weiter ───────────────────────────────────────
  {
    keywords: ['verstehst du nicht', 'kapierst nicht', 'wie bitte'],
    texts: [
      `Hmm. Des hab i ned ganz mitkriegt. Frag nochmal anders rum?`,
      `Manchmal bin i a bissl langsam. 😄`,
    ],
  },
  {
    keywords: ['keine ahnung', 'weiß nicht', 'ratlos'],
    texts: [
      `Puh. Woaß i grad ned.`,
      `Da fragst besser kurz beim Team nach.`,
      `Da will i nix Falsches erzähl'n.`,
    ],
  },

  // ── Verabschiedung ──────────────────────────────────────────────────
  {
    keywords: ['tschüss', 'bis dann', 'ciao', 'bye', 'machs gut', 'auf wiedersehen', 'pfiat di'],
    texts: [
      `Pfiat di. Und falls'd mi brauchst – i bin do. 😊`,
      `Pfiat di. Und schau dass'd no wos vom Festival mitkriegst.`,
      `So. Und jetzt geh wieder raus. Da draußen passiert mehr als in dem Chat. 😄`,
      `Mach's guad. I bin do, falls'd später no wos brauchst.`,
      `I lauf ned weg. Schau erst amoi wos am Gelände los is.`,
      `Bis später. Da draußen passiert grad wahrscheinlich mehr als in dem Chat. 😊`,
      `Pfiat di. Und verlauf di ned. Oder wenigstens ned zu weit.`,
    ],
  },
]

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
}

// Splits a normalized string into individual words, stripping leftover punctuation.
function wordsOf(norm) {
  return norm.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 0)
}

// Returns how many words a keyword contributes if ALL its words appear in inputWords.
// Multi-word keywords score higher, so "lustige geschichte" (2) beats "geschichte" (1).
function scoreKeyword(normalizedKeyword, inputWords) {
  const kWords = wordsOf(normalizedKeyword)
  if (kWords.length === 0) return 0
  return kWords.every(kw => inputWords.includes(kw)) ? kWords.length : 0
}

const NORMALIZED_RESPONSES = RESPONSES.map(r => ({
  keywords: r.keywords.map(normalize),
  text: r.text,
  texts: r.texts,
}))

// ─── Lineup-aware Band-Zeit-Lookup ──────────────────────────────────────────

const DAY_LABEL = { FRI: 'Freitag (28.8.)', SAT: 'Samstag (29.8.)' }

// For each band, keep only name words >= 4 chars as search tokens (filters
// out short connectors like "von", "and" etc. that could cause false matches).
const BAND_LOOKUP = Object.entries(LINEUP).flatMap(([day, bands]) =>
  bands.map(b => ({
    normWords: wordsOf(normalize(b.name)).filter(w => w.length >= 4),
    name: b.name,
    time: b.time,
    day,
    secret: b.secret ?? false,
  }))
).filter(b => b.normWords.length > 0)

const TIME_QUERY_WORDS = new Set([
  'wann', 'uhrzeit', 'uhr', 'spielt', 'spielen', 'auftritt',
  'anfang', 'faengt', 'beginnt', 'startet', 'anfaengt',
])

function matchBandTime(input) {
  const norm = normalize(input.trim())
  if (!norm) return null
  const inputWords = wordsOf(norm)

  if (!inputWords.some(w => TIME_QUERY_WORDS.has(w))) return null

  let bestBand = null
  let bestScore = 0

  for (const band of BAND_LOOKUP) {
    const matches = band.normWords.filter(w => inputWords.includes(w)).length
    if (matches > 0 && matches > bestScore) {
      bestScore = matches
      bestBand = band
    }
  }

  if (!bestBand) return null

  if (bestBand.secret) {
    const secretResponses = [
      `Wer da spielt, verrat i ned. Des ist Absicht. 😏`,
      `Des Late Night Special bleibt a Überraschung. Komm einfach und schau. 🌙`,
    ]
    return { text: secretResponses[Math.floor(Math.random() * secretResponses.length)] }
  }

  const day = DAY_LABEL[bestBand.day]
  const timeResponses = [
    `${bestBand.name} spielt am ${day} um ${bestBand.time} Uhr. 🎸`,
    `${bestBand.name} is am ${day} um ${bestBand.time} Uhr dran. Da wär i dabei! 🤘`,
    `Am ${day} um ${bestBand.time} Uhr — dann geht ${bestBand.name} los. Steh lieber a paar Minuten früher vor der Bühne!`,
  ]
  return { text: timeResponses[Math.floor(Math.random() * timeResponses.length)] }
}

// ─── Wetter-Antworten ────────────────────────────────────────────────────────

const WEATHER_QUERY_WORDS = new Set([
  'wetter', 'regen', 'hitze', 'gewitter', 'temperatur', 'warm', 'kalt',
  'sonnig', 'bewoelkt', 'nebel', 'schauer', 'wind',
])

function pickW(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function describeWeatherDay(d) {
  const { dayName, temp, rain, condition, icon } = d

  if (condition === 'gewitter') return pickW([
    `${dayName}: ${temp}°C und Gewitter im Anmarsch. ${icon} Wenn's blitzt kurz unterm Dach — danach wieder raus. Des Festival geht trotzdem weiter. 🤘`,
    `${dayName} könnt ruppig werden — ${temp}°C, Gewitter möglich (${rain}%). ${icon} Aber des is Bayern im August, ned überraschend.`,
  ])

  if (rain >= 65) return pickW([
    `${dayName} wird feucht — ${temp}°C, ${condition} ${icon}, ${rain}% Regen. Regenjacke is ned optional, des is a Pflicht.`,
    `${dayName}: ${temp}°C, ${condition} ${icon}. ${rain}% Regenwahrscheinlichkeit — i würd des ned ignorieren. Pack a Jacke ei.`,
  ])

  if (rain >= 35) return pickW([
    `${dayName}: ${temp}°C, ${condition} ${icon} — ${rain}% Regen. A Jacke einpacken schad ned. Wennst's ned brauchst, umso besser.`,
    `${dayName} könnt a bissl nass werden — ${temp}°C, ${rain}% Regen. ${icon} Jacke rein, dann kannst'd vergessen.`,
  ])

  if (temp >= 30) return pickW([
    `${dayName} brennt — ${temp}°C, ${condition}. ${icon} Sonnencreme is kein Vorschlag, des is a Befehl. Und Wasser. Viel Wasser.`,
    `${dayName}: heiße ${temp}°C, ${condition} ${icon}. Wasser trinken, Schatten suchen, Sonnencreme. In der Reihenfolge.`,
  ])

  if (temp >= 24) return pickW([
    `${dayName} schaut hervorragend aus — ${temp}°C, ${condition}. ${icon} ${rain > 0 ? `${rain}% Regen — glaub i ned wirklich.` : 'Kein Regen in Sicht.'} Besser geht's kaum für a Freiluftfestival.`,
    `${dayName}: ${temp}°C, ${condition} ${icon}. ${rain > 0 ? `${rain}% Regen — eher symbolisch.` : 'Koa Regen.'} Schöner Festivaltag.`,
  ])

  if (temp < 18) return pickW([
    `${dayName}: ${temp}°C, ${condition} ${icon}. Bissl frisch für August — abends pack was Wärmeres ei, auf'm Feld zieht's.`,
    `${dayName} wird frisch — nur ${temp}°C, ${condition}. ${icon} A Pulli für später is koa schlechte Idee.`,
  ])

  return pickW([
    `${dayName}: ${temp}°C, ${condition} ${icon}. ${rain > 0 ? `${rain}% Regen — ma schau.` : 'Kein Regen erwartet.'} Ned glamourös, aber bassd scho.`,
    `${dayName}: ${temp}°C, ${condition} ${icon}. ${rain > 0 ? `${rain}% Regenwahrscheinlichkeit — unkritisch.` : 'Schaut trocken aus.'} Passt.`,
  ])
}

function matchWeather(input) {
  const days = getWeatherDays()
  if (!days?.length) return null

  const norm = normalize(input.trim())
  const inputWords = wordsOf(norm)
  if (!inputWords.some(w => WEATHER_QUERY_WORDS.has(w))) return null

  return { text: days.map(describeWeatherDay).join(' ') }
}

export const SUGGESTED_QUESTIONS = [
  'Servus! Wer bist du?',
  "Was gibt's zu essen?",
  "Wann fängt's an?",
  'Gibt es Camping?',
]

export function matchPatrick(input) {
  const bandTime = matchBandTime(input)
  if (bandTime) return bandTime

  const weather = matchWeather(input)
  if (weather) return weather

  const norm = normalize(input.trim())
  if (!norm) return null
  const inputWords = wordsOf(norm)

  let bestEntry = null
  let bestScore = 0

  for (const r of NORMALIZED_RESPONSES) {
    for (const kw of r.keywords) {
      const score = scoreKeyword(kw, inputWords)
      if (score > bestScore) {
        bestScore = score
        bestEntry = r
      }
    }
  }

  if (!bestEntry) return null
  if (bestEntry.texts && bestEntry.texts.length > 0) {
    return { text: bestEntry.texts[Math.floor(Math.random() * bestEntry.texts.length)] }
  }
  return { text: bestEntry.text }
}
