/* eslint-disable global-require, import/no-unresolved, react/no-multi-comp, max-len, no-undef, semi, react/prop-types */
import React from 'react'
import { render } from 'react-dom'
import withScrollReveal from '../src/index'
import './main.css'

const WallOfText = ({ animationContainerReference }) => (
  <div className="container" ref={animationContainerReference}>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, labore quo? Dolor eius
      neque odit quis quo. Adipisci corporis dolorem fugit id, laboriosam minima odio porro quibusdam repudiandae sit,
      tempore, ut voluptas? Amet consequatur earum itaque natus quia totam ullam. Autem doloremque esse impedit
      laudantium nobis perferendis soluta totam vero?</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid amet animi aperiam
      assumenda atque aut commodi consequuntur distinctio dolore earum eligendi esse et eum expedita hic illo in
      inventore itaque, labore laboriosam magnam nam neque nesciunt nisi perspiciatis porro, quia, ratione reiciendis
      reprehenderit sit tempora tenetur velit. Aperiam, quasi!</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consectetur distinctio
      harum molestias nesciunt vel velit. Deserunt facilis iusto libero quo ut! A ab accusamus at commodi deleniti
      dolorem eaque error explicabo facere illo maxime numquam omnis perspiciatis placeat recusandae reprehenderit
      repudiandae sed similique sit, sunt temporibus tenetur vitae voluptatem!</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquam aspernatur
      blanditiis consectetur cum distinctio dolor dolorem doloremque dolorum earum error esse et explicabo fugiat
      ipsum, laborum libero molestiae nihil nulla obcaecati provident quidem quos reiciendis rem repellat repellendus
      tenetur unde ut vero voluptatum? Aliquam, delectus, nemo. Esse, sunt, voluptas.</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos dolorem doloremque,
      eum ipsam magnam natus numquam officiis praesentium quo veniam. Accusantium autem commodi cum, dolorum error ex
      expedita hic iure iusto maxime mollitia neque nulla temporibus veritatis voluptate. At cupiditate dolores
      mollitia quasi rerum veritatis voluptas. Ex laudantium magni quod!</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid aperiam aspernatur
      blanditiis consequatur culpa cupiditate deserunt dolor, doloremque eaque eos ex facere illum in labore
      laboriosam, minima nemo nulla pariatur provident quae quasi quia quo rem repudiandae sequi sint ut veniam vero
      voluptatem voluptates. Cumque laboriosam laborum natus porro vero!</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias dolore ipsum molestias
      provident rem voluptate. Accusantium adipisci animi aperiam est facere incidunt ipsa magni nemo neque odio odit
      placeat quaerat quam, soluta veritatis. Dicta dignissimos esse, harum libero minus nulla praesentium quaerat
      quibusdam quisquam reiciendis repellat sed, temporibus ullam unde.</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus alias beatae delectus
      doloribus ea eligendi est maiores minima non officia, quidem reiciendis sint, voluptate. Consequuntur error nisi
      omnis perspiciatis quaerat. Cum facilis odit repellat totam voluptas. Architecto aut delectus dolore dolorum, et
      fugiat libero nam quae quis quisquam, voluptates voluptatibus.</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusantium ad aliquam,
      asperiores atque consequuntur, corporis ea est et itaque maxime, minus nemo odit quos ut vel voluptatem? Commodi
      deleniti dicta dolores dolorum earum enim fugit inventore maiores molestiae odio pariatur quibusdam quos
      reiciendis sint, soluta sunt tempore vitae voluptatum?</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab animi atque, earum enim est
      excepturi facilis fugit id illo itaque libero magni modi non, nulla obcaecati officia officiis omnis pariatur
      porro quis reiciendis repudiandae similique soluta suscipit voluptatum? Culpa debitis placeat quo repellat ullam
      veniam. Dolorum expedita natus sint voluptatum.</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad amet cupiditate et eveniet
      quasi? Aliquid amet cupiditate distinctio dolorum eos est fugit illo impedit labore laudantium non quasi quo,
      quod sapiente similique sint tempora! Amet beatae dolorem doloribus ea facilis fugit impedit incidunt labore
      quaerat, quibusdam, quisquam rem repellat tempore?</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, adipisci aut
      consectetur consequatur consequuntur deleniti doloremque ea earum, eum excepturi harum impedit nisi porro quas
      qui similique, vel. Aliquid aut culpa eos explicabo hic, impedit in incidunt ipsa itaque mollitia officiis
      pariatur quos recusandae, sequi sit totam voluptate voluptates. Odit.</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus explicabo id nostrum
      officiis quaerat qui quibusdam ut. Aliquam beatae consequuntur dolore eligendi esse et excepturi fugit illum,
      incidunt inventore ipsam necessitatibus, nisi odit temporibus voluptates! Accusantium, aliquam assumenda atque
      corporis exercitationem, impedit ipsam maxime neque nulla optio quasi reiciendis voluptate.</p>
    <div className="col"><p className="sr-item--sequence">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      Architecto aut distinctio ducimus earum eum exercitationem explicabo officiis reiciendis, repudiandae. Atque
      dolor eius inventore ipsam laudantium modi nesciunt optio ratione vero?</p></div>
    <div className="col"><p className="sr-item--sequence">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      Accusantium corporis, eius enim et facilis harum illum inventore, iure, maiores nesciunt non nostrum officia
      perferendis quae quas reiciendis repellat sint voluptatem.</p></div>
    <div className="col"><p className="sr-item--sequence">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      Alias architecto atque culpa eaque eos et, excepturi illo incidunt minus perspiciatis sapiente sit tempora
      tenetur vero voluptas. Corporis incidunt iusto sed.</p></div>
    <div className="col"><p className="sr-item--sequence">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      Amet aspernatur commodi culpa dolor eaque expedita laboriosam magnam molestiae mollitia neque officia optio
      possimus quas, quidem quos temporibus tenetur vel vero!</p></div>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque delectus ea illo impedit,
      pariatur quibusdam quisquam repellendus. Aliquam asperiores aut beatae commodi dolorem ea et, illo incidunt
      ipsum magni ratione sapiente sit soluta? Architecto beatae consequuntur corporis deserunt earum, ex facere
      facilis illum in ipsum, itaque perferendis reprehenderit ut voluptas?</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae dolores magnam repudiandae
      sit? Aut autem consequuntur, earum iusto non ullam! Accusamus, aliquam animi, at delectus eaque hic id ipsa
      itaque, laborum molestias nobis praesentium quam quas sint tempore. Aliquid, asperiores autem dolorum facere
      harum maxime nemo optio reiciendis repellendus vero?</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto asperiores delectus
      doloremque eum fugiat illum incidunt iste, maxime minima minus nesciunt nostrum nulla numquam optio perspiciatis
      praesentium quisquam, quos, recusandae rerum soluta suscipit voluptates voluptatum? Aspernatur blanditiis
      consectetur tempora vel! Alias dolorum nulla perferendis placeat quia repellat voluptas. Ex, pariatur.</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae corporis deleniti dolore
      dolores eos error eum fuga fugit, illum inventore labore modi nisi non nulla perferendis quas quo quos ratione
      totam, vitae! Ad doloremque doloribus quae? Alias facere impedit laborum, maiores qui recusandae reiciendis
      tenetur? Ab cupiditate natus nihil voluptas?</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias assumenda aut culpa
      distinctio, explicabo illo in inventore iste laborum magni minus mollitia neque nostrum numquam odio officiis
      placeat quas quasi qui quibusdam quisquam quod rem repellendus tempora unde ut vitae voluptates. Alias beatae
      cumque deleniti, dicta ipsa libero nesciunt repudiandae.</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet atque aut culpa ipsam iure
      magni necessitatibus, officiis repellat sed tempore? Atque blanditiis dolores doloribus, error id in ipsum iste
      itaque minima numquam optio quia voluptate? Ab consectetur eius fugit iste nisi! Alias autem explicabo neque,
      optio similique veniam voluptate. Maxime?</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem blanditiis cupiditate
      dolorem, eligendi iusto laudantium magni minima nobis nostrum possimus, quos reiciendis repudiandae tempora
      ullam unde veniam veritatis. Accusamus aliquid asperiores atque, corporis dolor doloremque dolorum eaque error
      et hic illo molestiae natus possimus provident quae quam rem sapiente voluptas?</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo fugiat harum illum
      natus necessitatibus nobis suscipit velit? Amet architecto deleniti dignissimos explicabo harum ipsum,
      laudantium libero nemo obcaecati odit provident, recusandae reprehenderit vitae. A inventore libero officiis
      temporibus voluptatem! Alias aut dicta distinctio ipsum laboriosam magnam maiores nemo nisi quasi?</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam asperiores assumenda
      atque consequuntur eligendi fuga, fugit id magnam magni maxime, obcaecati officia perferendis praesentium quia
      quis quod repellat, reprehenderit rerum similique sunt? Cum, dicta dolore eaque id iure nisi reprehenderit.
      Aliquam illum laborum nostrum quaerat velit veniam. Aliquam, dignissimos, soluta.</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur doloribus, eius ipsa
      magnam magni natus nisi nulla praesentium voluptatem voluptates. Ab amet atque, blanditiis culpa deleniti
      doloremque ducimus eos error expedita harum libero, maxime modi officiis provident, tenetur totam voluptatum. A,
      dolor doloribus exercitationem facere inventore nisi quos saepe voluptatibus!</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum, nobis temporibus. Animi
      dolor earum eveniet illo incidunt laborum magnam nemo nobis perspiciatis porro, praesentium quaerat sequi
      tempora! A amet soluta sunt ut voluptas. Ad, architecto blanditiis, cum delectus dolores in nemo, obcaecati odio
      qui quidem quo quod repellendus unde. Quae?</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto dolores possimus quam
      tenetur. A aliquam aperiam dolorem doloremque eos esse, est harum illum, ipsam maiores molestiae, neque
      obcaecati perferendis praesentium provident quae quia quos ut? Alias asperiores assumenda corporis hic maiores,
      nihil non tempora. A distinctio doloremque numquam tempore velit?</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores dolor ex labore
      quisquam sunt! Accusantium alias aliquam assumenda beatae commodi consequatur cumque deserunt, distinctio dolor
      dolorem doloremque fuga fugiat id impedit ipsam iste itaque iure nam nostrum, numquam odio omnis optio
      praesentium quae quaerat quisquam sint suscipit unde vero voluptatum!</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad amet atque autem consequatur
      culpa cumque deserunt distinctio doloremque error ex expedita explicabo, fugit, in incidunt maxime, molestias
      nam neque officiis quas quasi qui quia reiciendis similique sit tenetur! Accusantium architecto aut deleniti
      dolor eaque ipsam mollitia provident quasi sint ullam!</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A assumenda at dolor harum modi
      nisi quibusdam quos. Consectetur dicta distinctio eos facere minus modi natus non sapiente veritatis? Aliquid,
      consequuntur, deleniti dignissimos esse fuga labore laudantium minima nisi nostrum nulla officia officiis
      perspiciatis quidem quos saepe, suscipit unde veritatis voluptate!</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem deleniti dicta earum
      eius excepturi, exercitationem molestiae nisi quae quibusdam repellat sed. Dignissimos dolores, ducimus et in
      nihil quisquam rerum! Consequuntur ex iste neque quas vitae. Alias assumenda doloribus dolorum exercitationem,
      in minima obcaecati, porro quaerat quos, rerum ut veritatis?</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusamus consequatur debitis
      dolor doloribus esse eveniet exercitationem illo ipsa nesciunt, nisi nobis nulla numquam perspiciatis placeat
      ullam vero voluptas voluptate. Amet blanditiis cupiditate debitis doloribus et eveniet in, magni maxime minima
      praesentium sequi sit, unde voluptatibus. Consectetur deserunt laboriosam temporibus.</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquid consequuntur
      cumque distinctio dolore id incidunt praesentium sequi voluptate voluptates? A ad aperiam distinctio doloribus
      error et inventore, modi perferendis quae qui tempora ut, velit vero? Atque molestias natus porro quisquam rem
      sunt? Ab accusamus delectus ipsa labore possimus ut!</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A adipisci aperiam asperiores
      aspernatur assumenda commodi consequatur consequuntur culpa cum debitis deleniti dolores ea est et ex fugiat
      fugit id iste iure libero maiores nostrum obcaecati quod ratione, sapiente sit temporibus vel? Enim ex ipsum
      iusto laborum provident quidem quis quisquam.</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur beatae consequuntur
      corporis delectus distinctio, eius error explicabo fugiat illo labore libero modi, molestiae mollitia officia
      optio pariatur quam quis quos rerum soluta? Atque delectus, minus nobis officiis repudiandae temporibus?
      Adipisci animi dignissimos esse facere illo ipsa odio quae temporibus voluptate!</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet at autem beatae corporis cum
      dolor, ea explicabo inventore ipsum magni mollitia nemo nihil, quam quibusdam voluptates. Adipisci animi
      asperiores cum delectus dolor, dolore, ex exercitationem hic in iure labore mollitia odit quam ratione tempora
      vel voluptatem! Incidunt non quo sapiente.</p>
    <p className="sr-item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, aperiam asperiores
      blanditiis eius eum excepturi expedita facere fuga fugit illo inventore natus nemo neque officiis placeat
      recusandae reiciendis rem similique sit totam? Autem beatae consectetur, consequatur earum, enim eos laborum
      nemo neque perferendis porro quis reprehenderit sunt tempore? Odio, voluptatibus.</p>
  </div>
);

const WrappedComponent = withScrollReveal([
  {
    selector: '.sr-item',
    options: {
      reset: true
    }
  },
  {
    selector: '.sr-item--sequence',
    options: {
      reset: true,
      delay: 400
    },
    interval: 100
  }
])(WallOfText);

render(
  <WrappedComponent />,
  document.getElementById('app')
);
