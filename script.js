(function() {


    let inp = document.getElementById('inp');
    let result = document.getElementById('result');
    let plusbtn = document.querySelector('plus');



    inp.addEventListener('keypress', function(event) {
        if (event.keyCode == 13) {
            let val = inp.value;

            let li = document.createElement('li');



            let spanleft = document.createElement('span');
            spanleft.classList.add('left');
            spanleft.addEventListener('click', deleteLi, false);
            let ileft = document.createElement('i');
            ileft.classList.add('fa', 'fa-trash');
            spanleft.append(ileft);
            li.append(spanleft);
            li.append(val);


            let spanright = document.createElement('span');
            spanright.classList.add('right');
            spanright.addEventListener('click', editLi, false);
            let iright = document.createElement('i');
            iright.classList.add('fa', 'fa-edit');
            spanright.append(iright);
            li.append(spanright);
            result.prepend(li);
        }
    });


    function editLi() {
        inp.value = this.parentNode.innerText;
        this.parentNode.parentNode.removeChild(this.parentNode);
    }


    function deleteLi() {
        this.parentNode.parentNode.removeChild(this.parentNode);
    }

})();


// $("ul").on("click", "li", function() {
//     $(this).toggleClass("completed");
// });

// $("ul").on("click", "span", function(event) {
//     $(this).parent().fadeOut(500, function() {
//         $(this).remove();
//     });
//     event.stopPropagation();
// });

// $("input[type='text']").keypress(function(event) {
//     if (event.which === 13) {
//         var todoText = $(this).val();
//         $(this).val("");
//         $("ul").append("<li><span><i class='fa fa-trash'></i></span> " + todoText + "</li>")
//     }
// });

// $(".fa-plus").click(function() {
//     $("input[type='text']").fadeToggle();
// });