/* eslint-disable prettier/prettier */
import { Disclosure } from '@headlessui/react'
import classNames from '@lib/classNames'
import { FC, ReactNode } from 'react'
import { Chevron } from './icons/Chevron'

const FAQS: {
  question: string
  answer: ReactNode
}[] = [
  {
    question: 'Mir geht es schlecht. Wo finde ich sofort Hilfe?',
    answer: (
      <p>
        Hier findest du die{' '}
        <a href="https://www.berliner-notruf.de/">
          Psychosozialen Nothilfenummern Berlins
        </a>
        .
      </p>
    ),
  },
  {
    question:
      'Welche Einrichtungen oder Angebote können bei HILF-MIR Berlin gefunden werden?',
    answer: (
      <p>
        HILF-MIR Berlin ermöglicht die Suche nach niedrigschwelligen
        psychosozialen Angeboten. Es werden alle Angebote berücksichtigt, die du
        ohne besondere Zugangsvoraussetzungen im Rahmen ihrer Öffnungszeiten
        aufsuchen oder zumindest anrufen oder anschreiben kannst. Viele dieser
        Angebote werden vom Land Berlin gefördert, manche Beratungsangebote
        werden sogar von den Mitarbeitenden der Bezirksämter selbst erbracht und
        andere haben gar keine Verbindung mit dem Land Berlin. Uns ist es
        wichtig, dir eine möglichst große Auswahl qualifizierter Angebote zu
        zeigen, damit du das Angebot finden kannst, bei dem du dich mit deinem
        Thema am besten aufgehoben fühlst.
      </p>
    ),
  },
  {
    question:
      'Welche Einrichtungen können NICHT bei HILF-MIR Berlin gefunden werden?',
    answer: (
      <>
        <p>
          HILF-MIR Berlin hat keinen Fokus auf psychiatrische oder
          psychotherapeutische Behandlung. Hierzu kannst du einfach die
          Ärztinnen und Ärzte bzw. Psychotherapeutinnen und -therapeuten-
          <a href="https://www.kvberlin.de/fuer-patienten/arzt-und-psychotherapeutensuche">
            Suche der Kassenärztlichen Vereinigung Berlins
          </a>{' '}
          nutzen.
        </p>
        <p>
          Weiterhin führen wir üblicherweise bei HILF-MIR Berlin keine
          Wohnprojekte auf – Therapeutische Wohngruppen, betreutes Einzelwohnen
          und andere besondere Wohnformen sind Leistungen der Teilhabe für
          Menschen mit einer seelischen Behinderung. Ob du für diese in Frage
          kommst, erfährst du im Gespräch mit dem Teilhabefachdienst von deinem
          Bezirk{' '}
          <a href="https://www.teilhabeberatung.de/artikel/ueber-die-app-teilhabeberatung">
            oder in der Teilhabefachdienst-App.
          </a>
        </p>
        <p>
          Bisher können wir nur einzelne Selbsthilfegruppen in dieser Version
          von HILF-MIR Berlin integrieren. Aktuell findest du eine gute
          Übersicht über passende Selbsthilfegruppen auf{' '}
          <a href="https://sekis-berlin.de/">Sekis-Berlin</a> und bei der{' '}
          <a href="https://www.landesstelle-berlin.de/adressen/suchtselbsthilfegruppen/suche-suchtselbsthilfegruppen-in-berlin/">
            Landesstelle für Suchtfragen
          </a>
          .
        </p>
      </>
    ),
  },
  {
    question:
      'Welche Daten werden von mir gespeichert, wenn ich HILF-MIR Berlin benutze?',
    answer: (
      <>
        <p>
          Die Internetseite HILF-MIR Berlin speichert keine Daten von dir. Zur
          Benutzung der Suche, werden deine Eingaben (z.B. ausgewählte
          Schlagworte, Filter) zur Darstellung der passenden Suchergebnisse nur
          in dem Moment der Suche zwar verarbeitet, aber nicht gespeichert.
        </p>
        <p>
          HILF-MIR Berlin kommt ganz ohne Cookies aus. Weitere Informationen,
          findest du in der allgemeinen{' '}
          <a href="https://www.technologiestiftung-berlin.de/datenschutz">
            Datenschutzerklärung der Technologiestiftung Berlin.
          </a>
        </p>
      </>
    ),
  },
  {
    question:
      'Wieso finde ich auf diesen Seiten keine TherapeutInnen und ÄrztInnen?',
    answer: (
      <>
        <p>
          HILF-MIR Berlin ermöglicht die Suche nach niedrigschwelligen
          sozialpsychiatrischen Angeboten einschließlich Angeboten der
          Suchthilfe. TherapeutInnen und ÄrztInnen gehören nicht dazu.
        </p>
        <p>
          Zur Suche von TherapeutInnen und ÄrztInnen steht dir die Arzt- und
          Psychotherapeutensuche der Kassenärztlichen Vereinigung (KV) Berlin
          zur Verfügung. Hier gelangst du zu dem{' '}
          <a href="https://www.kvberlin.de/fuer-patienten/arzt-und-psychotherapeutensuche">
            Angebot der KV Berlin
          </a>
          .
        </p>
      </>
    ),
  },
  {
    question:
      'Ich bin Anbieter eines (niedrigschwelligen) Angebots und finde meine Einrichtung auf dieser Seite nicht, wo kann ich mich eintragen lassen?',
    answer: (
      <p>
        Bitte schreibe eine Mail an:{' '}
        <a href="mailto:info@hilf-mir.berlin">info@hilf-mir.berlin</a>
      </p>
    ),
  },
  {
    question:
      'Ich bin Anbieter eines (niedrigschwelligen) Angebots und die Informationen zu meiner Einrichtung auf dieser Seite sind nicht mehr aktuell, wohin kann ich mich wenden?',
    answer: (
      <p>
        Bitte schreibe eine Mail an:{' '}
        <a href="mailto:info@hilf-mir.berlin">info@hilf-mir.berlin</a>
      </p>
    ),
  },
  {
    question: 'An wen richte ich Lob und Kritik?',
    answer: (
      <>
        <p>
          HILF-MIR Berlin wächst und verbessert sich dank der Unterstützung
          vieler Mitwirkender. Lob und Kritik ist dabei essentiell. Wir freuen
          uns über deine Nachricht.
        </p>
        <p>
          Bitte schreibe eine Mail mit deinem Lob oder deiner Kritik an:{' '}
          <a href="mailto:info@hilf-mir.berlin">info@hilf-mir.berlin</a>
        </p>
      </>
    ),
  },
  {
    question: 'Warum gibt es das Informationsangebot HILF-MIR Berlin?',
    answer: (
      <>
        <p>
          Berlin hat im Versorgungssystem eine Vielzahl an Hilfen und Angeboten
          im Bereich der Psychiatrie und Suchthilfe. Zurzeit ist es schwierig im
          Internet passende Hilfe im Bereich der Psychiatrie und Sucht zu
          finden. Im Internet gibt es viele verschiedene Seiten von Verwaltung,
          Trägern und anderen Anbietern.
        </p>
        <p>Die Ziele von HILF-MIR Berlin sind:</p>
        <ul>
          <li>
            Hindernisse bei der Hilfesuche abbauen, indem die Hilfsangebote
            einfach und übersichtlich dargestellt werden
          </li>
          <li>
            Genauere, schnellere und am Bedarf orientierte Hilfevermittlung
          </li>
          <li>Weitere Gruppen von Nutzenden erschließen</li>
          <li>Vermittlungsarbeit der Fachkräfte erleichtern</li>
        </ul>
      </>
    ),
  },
  {
    question:
      'Wer war an der Entwicklung dieser Seite beteiligt und wer sind die Ansprechpersonen?',
    answer: (
      <>
        <p>
          HILF-MIR Berlin ist ein Angebot des{' '}
          <a href="https://www.citylab-berlin.org">CityLAB Berlin</a> und wurde
          durch die Senatsverwaltung für Wissenschaft, Pflege und Gleichstellung
          unterstützt.
        </p>
      </>
    ),
  },
  {
    question:
      'Ich suche Angebote zum betreuten Wohnen oder zur Tagesstruktur und kann sie auf der Seite nicht finden. Wo finde ich Angebote dazu?',
    answer: (
      <p>
        Angebote des betreuten Wohnens und Tagesstätten sind Leistungen der
        Teilhabe für Menschen mit einer seelischen Behinderung
        (Eingliederungshilfe). Ob du für diese in Frage kommst, erfährst du im
        Gespräch mit dem Teilhabefachdienst deines Bezirks. Dieser ist für die
        Beratung und die Antragsstellung in der Eingliederungshilfe zuständig.
      </p>
    ),
  },
  {
    question:
      'Welche Interessenvertretungen für psychiatrieerfahrene Personen gibt es in Berlin?',
    answer: (
      <p>
        Die folgenden Betroffenen- oder Angehörigenverbände sind Mitglied oder
        Stellvertretende im Berliner Landesbeirat für psychische Gesundheit:
        <ul>
          <li>
            <a href="http://www.apk-berlin.de/de">
              Angehörige psychisch erkrankter Menschen Berlin e.V.
            </a>
          </li>
          <li>
            <a href="https://bopp-ev.de/">
              Berliner Organisation Psychiatrie-Erfahrener und
              Psychiatrie-Betroffener
            </a>
          </li>
          <li>
            <a href="https://www.bipolaris.de/"> Bipolaris e.V.</a>
          </li>
          <li>
            <a href="https://bpe-online.de/">
              Bundesverband Psychiatrie-Erfahrener e.V.
            </a>
          </li>
          <li>
            <a href="https://expeerienced.de/">
              exPEERienced – erfahren mit seelischen Krisen e.V.
            </a>
          </li>
        </ul>
      </p>
    ),
  },
  {
    question:
      'Sie haben schlechte Erfahrungen mit der psychiatrischen Versorgung gemacht?',
    answer: (
      <>
        <p>
          Die Beschwerde- und Informationsstelle Psychiatrie in Berlin (BIP)
          bietet Beratung, Begleitung und Informationen bei Beschwerden zur
          psychiatrischen Versorgung in Berlin für Psychiatrie-Erfahrene,
          Angehörige und professionell Tätige. Du kannst dich dort anonym und
          unbürokratisch über mögliche Beschwerdewege und alternative
          Handlungsmöglichkeiten informieren. Auf Wunsch wirst du bei der
          Klärung Ihrer Beschwerdeanliegen gegenüber Dritten unterstützt. Der
          Fokus der BIP liegt dabei auf Behandlungen-, Betreuungs- und
          Unterbringungsbedingungen oder Umgangsweisen.
        </p>
        <p>So erreichst du die BIP:</p>
        <p>
          BIP – Beschwerde- und Informationsstelle Psychiatrie in Berlin
          <br />
          Grunewaldstraße 82
          <br />
          10823 Berlin
        </p>
        <p>
          Tel.: 030 – 789 500 360
          <br />
          Fax: 030 – 789 500 363
        </p>
        <p>
          E-Mail:{' '}
          <a href="mailto:info@psychiatrie-beschwerde.de">
            info@psychiatrie-beschwerde.de
          </a>
        </p>
        <p>Öffnungszeiten</p>
        <p>
          Mo 10-14 Uhr
          <br />
          Di 14-18 Uhr
          <br />
          Mi 10-14 Uhr (nur telefonisch)
          <br />
          Do 10-14 Uhr
        </p>
      </>
    ),
  },
]

export const FaqList: FC = () => {
  return (
    <ul
      className={classNames(
        `prose prose-p:text-black prose-li:pl-0 prose-li:mt-4 prose-headings:font-bold`,
        `prose-p:mt-2 prose-p:mb-8 w-[calc(100%+1.5rem)] -ml-3`
      )}
      aria-label="FAQ Questions"
    >
      {FAQS.map(({ question, answer }) => {
        return (
          <Disclosure
            as="li"
            key={question}
            aria-label="FAQ Question"
            className="w-full"
          >
            {({ open }) => (
              <>
                <Disclosure.Button
                  aria-label="Toggle FAQ Answer"
                  className={classNames(
                    `text-black text-left font-bold text-xl cursor-pointer hover:bg-purple-200`,
                    `w-full px-3 py-2 rounded transition-colors grid grid-cols-[1fr,auto] items-center`,
                    `gap-4`
                  )}
                >
                  <span>{question}</span>
                  <Chevron
                    orientation={open ? 'up' : 'down'}
                    className={`text-purple-500 scale-90`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel
                  aria-label="FAQ Answer"
                  className={classNames(!open && 'hidden', `px-4 mt-0`)}
                >
                  {answer}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        )
      })}
    </ul>
  )
}
