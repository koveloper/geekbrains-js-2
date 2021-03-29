const regExp = /\'(?!t|n)/gm
const text = "Lorem ipsum is'nt dolor, sit amet consectetur adipisicing elit. 'Odio ad accusantium deleniti, veritatis harum nam! Excepturi, possimus placeat'. Nisi blanditiis consequuntur cumque enim, consectetur nemo dolores nihil quod, suscipit repudiandae alias adipisci sint dolorum? Exercitationem, veniam necessitatibus! Veniam quisquam laboriosam, est non vero deserunt. Ipsam repellendus voluptatum, vero facere adipisci quasi deserunt voluptatem eos, quia ullam ducimus labore accusantium repellat delectus iure ratione officiis possimus neque dolor exercitationem asperiores voluptate accusamus eum facilis. Recusandae saepe dignissimos pariatur delectus obcaecati officiis repudiandae ab sint ipsa enim, eius inventore iste tempore quasi dolores porro nostrum atque asperiores nisi quam! Dolorem obcaecati dolorum quos voluptas aliquam aut iste eius. 'Fuga facilis et ut maxime asperiores aut molestiae expedita similique necessitatibus distinctio accusamus, itaque aliquam eaque, facere alias repellendus blanditiis corporis natus incidunt veritatis nostrum a?' Odio dolore sed temporibus fugit, perspiciatis rem accusamus ipsum deleniti maiores reprehenderit facere amet perferendis aut incidunt, earum in. Quis, facilis magnam dolor, perspiciatis mollitia optio temporibus amet hic possimus numquam blanditiis fuga quas? Recusandae adipisci numquam dicta eius consequuntur enim. Beatae, quasi maxime blanditiis odio, aren't minima dolorem laudantium consequatur, earum hic repudiandae provident. Consectetur eaque sint ullam maiores eligendi et consequuntur aliquam, expedita culpa error iure perferendis. 'This is a test of EOL after quote position'";

/** 
 Описание шаблона:
 \' - ищет одинарную кавычку
 (?!t|n):
    ?! - за которой НЕ следует
    t|n - символ s или n (is'nt, isn't, aren't, are'nt)

/g - ищет все совпадения
m - ищет в совпадения в мультистрочном режиме
 */

console.log(text.replace(regExp, "\""));