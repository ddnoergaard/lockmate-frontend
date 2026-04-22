export interface FunctionFeature {
  title: string
  body: string
}

export interface FunctionFaq {
  q: string
  a: string
}

export interface FunctionData {
  slug: string
  tag: string
  heading: string
  subheading: string
  description: string
  features: FunctionFeature[]
  highlight?: {
    heading: string
    body: string
  }
  faq: FunctionFaq[]
}

export const functionsData: FunctionData[] = [
  {
    slug: 'encryption',
    tag: 'Kryptering',
    heading: 'Militærkvalitets kryptering',
    subheading: 'Dine data er ulæselige for alle, inklusive os.',
    description:
      'Alle loginoplysninger du gemmer i Lockmate krypteres på din enhed, inden de nogensinde forlader den. Vi bruger AES-256 til lagring og Argon2id til adgangskodehashing. Ægte zero-knowledge betyder, at vi teknisk set aldrig kan læse dine data.',
    features: [
      {
        title: 'AES-256 kryptering',
        body: 'Den samme standard som banker og myndigheder bruger. Alle loginoplysninger krypteres individuelt inden lagring.',
      },
      {
        title: 'Argon2id hashing',
        body: 'Din masterkodeord gemmes aldrig. Den hashes lokalt med Argon2id, som er resistent over for brute-force og sidekanalsangreb.',
      },
      {
        title: 'Zero-knowledge arkitektur',
        body: 'Kryptering og dekryptering sker udelukkende på din enhed. Vores servere ser kun krypteret data.',
      },
      {
        title: 'Ende-til-ende krypteret deling',
        body: 'Når du deler loginoplysninger med en kollega, genkrypteres de med vedkommendes offentlige nøgle. Vi ser aldrig klarteksten.',
      },
    ],
    highlight: {
      heading: 'Vi kan ikke læse dine data. Det er pointen.',
      body: 'Zero-knowledge er ikke et markedsføringsord for os. Det er en hård teknisk begrænsning. Selv hvis vi ville udlevere dine oplysninger, kunne vi ikke. Din krypteringsnøgle forlader aldrig din enhed.',
    },
    faq: [
      {
        q: 'Hvad betyder zero-knowledge helt konkret?',
        a: 'Det betyder, at dine data krypteres på din enhed, inden de når vores servere. Vi gemmer kun krypteret data og har ingen teknisk mulighed for at dekryptere det, heller ikke hvis vi blev bedt om det.',
      },
      {
        q: 'Hvad sker der, hvis jeg glemmer min masterkodeord?',
        a: 'Da vi aldrig gemmer din masterkodeord, kan vi ikke gendanne den for dig. Du kan oprette en nødgendannelsesnøgle når du opretter din konto. Opbevar den et sikkert sted.',
      },
      {
        q: 'Er AES-256 virkelig ubrydelig?',
        a: 'AES-256 har ingen kendte praktiske angreb. Et brute-force-forsøg ville tage længere end universets alder med nuværende og forventet computerkraft.',
      },
      {
        q: 'Hvordan er deling ende-til-ende krypteret, når andre kan læse det?',
        a: 'Når du deler en loginoplysning, genkrypteres den specifikt til modtagerens offentlige nøgle. Kun deres private nøgle, der er gemt på deres enhed, kan dekryptere den.',
      },
    ],
  },
  {
    slug: 'cross-platform',
    tag: 'Tværplatform',
    heading: 'Adgang overalt',
    subheading: 'Din vault følger dig. Computer, mobil, browser. Alt er synkroniseret.',
    description:
      'Lockmate kører native på alle større platforme og synkroniserer øjeblikkeligt på tværs af alle dine enheder. Installer browserudvidelsen, mobilappen eller brug webappen. Dine loginoplysninger er altid tilgængelige, når du har brug for dem.',
    features: [
      {
        title: 'Browserudvidelse',
        body: 'Tilgængelig til Chrome, Firefox, Edge og Safari. Registrerer loginformularer automatisk og udfylder oplysninger med ét klik.',
      },
      {
        title: 'Mobilapp',
        body: 'iOS- og Android-apps med biometrisk oplåsning. Tilgå din fulde vault på farten uden at taste din masterkodeord hver gang.',
      },
      {
        title: 'Øjeblikkelig synkronisering',
        body: 'Ændringer du foretager på én enhed vises overalt inden for sekunder. Konfliktfrit og automatisk.',
      },
      {
        title: 'Offlineadgang',
        body: 'Din vault er cached lokalt og fuldt tilgængelig offline. Ændringer synkroniseres automatisk, når du er forbundet igen.',
      },
    ],
    highlight: {
      heading: 'Én vault. Alle enheder.',
      body: 'Vi byggede synkroniseringslaget fra bunden til at være hurtigt, konfliktfrit og krypteret under overførslen. Ingen tredjeparts synkroniseringsudbydere, ingen klartekst i skyen.',
    },
    faq: [
      {
        q: 'Hvilke platforme understøttes?',
        a: 'Lockmate kører på Windows, macOS, Linux, iOS og Android. Browserudvidelser er tilgængelige til Chrome, Firefox, Edge og Safari.',
      },
      {
        q: 'Hvor hurtigt sker synkroniseringen?',
        a: 'Ændringer overføres til alle enheder inden for få sekunder. Synkroniseringen er konfliktfri. Den seneste ændring vinder altid, og intet går tabt uden varsel.',
      },
      {
        q: 'Virker det offline?',
        a: 'Ja. Din vault er cached lokalt i krypteret form. Du kan læse og bruge loginoplysninger offline, og eventuelle ændringer synkroniseres automatisk, når du er online igen.',
      },
      {
        q: 'Er der en enhedsgrænse?',
        a: 'Nej. Du kan installere Lockmate på så mange enheder, du ejer. Alle planer inkluderer ubegrænset enhedsadgang.',
      },
    ],
  },
  {
    slug: 'autofill',
    tag: 'Autofill',
    heading: 'Autofill med ét klik',
    subheading: 'Stop med at taste adgangskoder. Lad Lockmate klare det.',
    description:
      'Lockmates browserudvidelse registrerer loginfelter automatisk og udfylder dine oplysninger øjeblikkeligt. Ingen kopier og indsæt, ingen søgen i en liste. Klik bare, og du er inde.',
    features: [
      {
        title: 'Automatisk registrering',
        body: 'Udvidelsen registrerer login- og tilmeldingsformularer, mens du surfer, og viser de rigtige oplysninger uden at du skal søge.',
      },
      {
        title: 'Tastaturgenvej',
        body: 'Aktivér autofill fra tastaturet uden nogensinde at røre musen. Kan konfigureres til dit workflow.',
      },
      {
        title: 'Understøttelse af flere konti',
        body: 'Har du flere konti til det samme site? Lockmate viser alle matchende loginoplysninger, så du kan vælge den rigtige.',
      },
      {
        title: 'Formularudfyldning',
        body: 'Ikke kun adgangskoder. Lockmate kan udfylde hele tilmeldingsformularer inkl. navn, email og adressefelter fra din profil.',
      },
    ],
    highlight: {
      heading: 'Den hurtigste vej ind på enhver konto.',
      body: 'Fra browser åbnet til logget ind tager Lockmates autofill ét klik. Ingen udvidelsespopups, ingen genindtastning af masterkodeord midt i en session.',
    },
    faq: [
      {
        q: 'Virker autofill på alle hjemmesider?',
        a: 'Autofill virker på langt de fleste loginformularer. For sites med ikke-standard formularer kan du manuelt aktivere udfyldning eller kopiere oplysninger med ét klik.',
      },
      {
        q: 'Vil det udfylde de forkerte oplysninger på delte domæner?',
        a: 'Nej. Lockmate matcher loginoplysninger til det præcise domæne og underdomæne. Du kan også fastgøre specifikke oplysninger til specifikke URL\'er for fuld kontrol.',
      },
      {
        q: 'Er autofill sikker mod phishing?',
        a: 'Ja. Lockmate udfylder kun på det præcise domæne, loginoplysningerne blev gemt til. Et phishing-site på et andet domæne vil aldrig automatisk modtage dine oplysninger.',
      },
      {
        q: 'Kan jeg bruge autofill i mobilapps?',
        a: 'Ja. På iOS og Android integrerer Lockmate med systemets autofill-udbyder, så oplysninger kan udfyldes i native apps såvel som i mobilbrowsere.',
      },
    ],
  },
  {
    slug: 'password-generator',
    tag: 'Generator',
    heading: 'Adgangskodegenerator',
    subheading: 'Ubrydelige adgangskoder genereret øjeblikkeligt.',
    description:
      'Enhver ny konto fortjener en unik, kompleks adgangskode. Lockmate genererer dem på bestilling med fuld kontrol over længde, tegnsæt og kompleksitet, og gemmer dem direkte i din vault.',
    features: [
      {
        title: 'Fuldt konfigurerbar',
        body: 'Angiv længde, inkluder eller ekskluder symboler, tal og tvetydige tegn. Tilpas kompleksiteten præcis til, hvad sitet kræver.',
      },
      {
        title: 'Adgangsfraseformat',
        body: 'Foretrækker du læsbare adgangskoder? Generer flerords-adgangsfraser, der er både stærke og nemme at huske.',
      },
      {
        title: 'Gem ved generering',
        body: 'Genererede adgangskoder gemmes direkte i din vault. Ingen risiko for at generere noget stærkt og derefter miste det.',
      },
      {
        title: 'Styrkeindikator',
        body: 'Realtidsfeedback på adgangskodestyrke, mens du konfigurerer den. Entropiberegning, ikke bare en farvebjælke.',
      },
    ],
    highlight: {
      heading: 'Genbrug af adgangskoder er sådan konti bliver kompromitteret.',
      body: 'Den eneste måde at have en unik adgangskode til enhver konto er at stoppe med at huske dem. Lockmates generator gør det ubesværet.',
    },
    faq: [
      {
        q: 'Hvad er den maksimale adgangskodeadlængde?',
        a: 'Du kan generere adgangskoder på op til 128 tegn. De fleste sites accepterer op til 64, men vi understøtter længere for tjenester, der tillader det.',
      },
      {
        q: 'Gemmes genererede adgangskoder automatisk?',
        a: 'Ja. Når du genererer en adgangskode under kontooprettelse, beder Lockmate dig om at gemme den med det samme. Du mister aldrig en stærk adgangskode.',
      },
      {
        q: 'Hvad er forskellen på en adgangskode og en adgangsfrase?',
        a: 'En adgangskode er en tilfældig tegnstreng. En adgangsfrase er en sekvens af tilfældige ord. Den er lettere at huske og taste og er lige så stærk ved tilstrækkelig længde.',
      },
      {
        q: 'Kan jeg generere adgangskoder i bulk?',
        a: 'Ja. Generatoren understøtter batch-oprettelse, hvilket er nyttigt til klargøring af flere konti på én gang eller rotation af et sæt loginoplysninger.',
      },
    ],
  },
  {
    slug: 'breach-monitoring',
    tag: 'Sikkerhed',
    heading: 'Brud-overvågning',
    subheading: 'Vær på forkant, inden angriberne handler.',
    description:
      'Lockmate overvåger løbende dine gemte loginoplysninger mod kendte databrudsdatabaser. Hvis nogen af dine konti optræder i et brud, adviseres du øjeblikkeligt, så du kan handle, inden skaden sker.',
    features: [
      {
        title: 'Løbende overvågning',
        body: 'Dine loginoplysninger tjekkes automatisk mod brudsdatabaser. Ikke kun når du logger ind eller kører en manuel scanning.',
      },
      {
        title: 'Øjeblikkelige advarsler',
        body: 'Brudsnotifikationer sendes via email og in-app, i det øjeblik et match findes. Ingen ugentlige oversigter, ingen forsinkelser.',
      },
      {
        title: 'Berørt loginoplysning fremhævet',
        body: 'Lockmate linker bruddet direkte til den truede loginoplysning, så du ved præcis hvilken adgangskode der skal skiftes.',
      },
      {
        title: 'Privatlivsbevarende tjek',
        body: 'Loginoplysnings-tjek bruger k-anonymitet. Dine faktiske adgangskoder sendes aldrig til nogen ekstern tjeneste.',
      },
    ],
    highlight: {
      heading: 'De fleste opdager brud måneder for sent.',
      body: 'Lockmate overvåger løbende, så du ikke er den sidste til at vide det. I det øjeblik dine loginoplysninger optræder i et brudsdatasæt, venter en advarsel på dig.',
    },
    faq: [
      {
        q: 'Hvordan tjekker Lockmate for brud uden at eksponere mine adgangskoder?',
        a: 'Vi bruger en k-anonymitetsmodel. Kun en delhash af din loginoplysning sendes til sammenligning. Din faktiske adgangskode forlader aldrig din enhed.',
      },
      {
        q: 'Hvor ofte tjekkes loginoplysninger?',
        a: 'Tjek kører løbende i baggrunden. Nye brudsdatabaser indlæses, så snart de offentliggøres, typisk inden for timer efter et brud bliver offentligt.',
      },
      {
        q: 'Hvad skal jeg gøre, når jeg modtager en brudsadvarsel?',
        a: 'Skift den berørte adgangskode øjeblikkeligt med generatoren, og tjek derefter om du har genbrugt den adgangskode andre steder. Lockmate fremhæver eventuelle andre konti med samme loginoplysning.',
      },
      {
        q: 'Dækker brud-overvågning også brugernavn- og emaillækager?',
        a: 'Ja. Overvågning dækker adgangskoder, emailadresser og brugernavne. Du adviseres, når nogen af dine gemte loginoplysninger optræder i et kendt brudsdatasæt.',
      },
    ],
  },
]
