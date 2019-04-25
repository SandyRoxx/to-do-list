(function() {

    let inp = document.getElementById('inp');
    let result = document.getElementById('result');
    var taskList = [];
    getArray();
    
    inp.addEventListener('keypress', function(event) {
        if (event.keyCode == 13) {
            addLi();  
        }
    });

    function addLi(){
        let val = inp.value;
       
        fetch('/add',{
           method:'POST',
           headers:new Headers({'content-type': 'application/json'}),
           body:JSON.stringify({"val":val})

        }).then(function(data){
            if(data.status!==200){
                return;
            }
            return data.text()
        }).then(function(result){
            taskList.push(result);
            display(result);
            localStorage.setItem('task',JSON.stringify(taskList)); 
            inp.value="";    
        }).catch(function(err){
            console.log(err);
    });


    }

    function display(val) {

        let li = document.createElement('li');

        let spanleft = document.createElement('span');
        spanleft.classList.add('left');
        spanleft.addEventListener('click', deleteLi, false);
        let ileft = document.createElement('i');
        ileft.classList.add('fa', 'fa-trash');
        spanleft.append(ileft);
        li.append(spanleft);

        let spancenter = document.createElement('span');
        let dataNode= document.createTextNode(val);
        spancenter.append(dataNode);
        li.append(spancenter);

        let spanright = document.createElement('span');
        spanright.classList.add('right');
        spanright.addEventListener('click', updateLi, false);
        let iright = document.createElement('i');
        iright.classList.add('fa', 'fa-edit');
        spanright.append(iright);
        li.append(spanright);
        result.prepend(li);
    }


    function updateLi() {
        var spancenter = this.previousSibling;
        var parent=this.parentNode;
        let oldvalue=spancenter.textContent;
        let index = taskList.indexOf(oldvalue);
        var input = document.createElement('input');
        input.type = 'text';
        input.value = spancenter.textContent;
        input.style.width="240px";
        input.style.height="40px";
        parent.replaceChild(input, spancenter);
        input.focus();
        input.addEventListener('keypress', function(event) {
            if (event.keyCode == 13) {
                let newvalue =input.value;
                fetch('/update',{
                    method:'POST',
                    headers:new Headers({'content-type': 'application/json'}),
                    body:JSON.stringify({"index":index,"oldvalue":oldvalue,"newvalue":newvalue})
                }).then(function(data){
                    if(data.status!==200){
                        return;
                    }
                    return data.json();
                }).then(function(result){
                    spancenter.innerHTML=newvalue;
                    parent.replaceChild(spancenter, input);
                    taskList=result;
                    localStorage.setItem('tsak',JSON.stringify(taskList));

                }).catch(function(err){
                    console.log(err);
                });
                
            }

        });
    }


    function deleteLi() {
        let that = this;
        let text = this.nextSibling.textContent;
        let index = taskList.indexOf(text);
       
        fetch('/delete',{method:'POST',
        headers:new Headers({'content-type': 'application/json'}),
        body:JSON.stringify({"index":index})
        }).then(function(data){
            if(data.status!==200){
                return;
            }
            return data.json();
        }).then(function(result){
            taskList=result;
            localStorage.setItem('task',JSON.stringify(taskList));
            that.parentNode.parentNode.removeChild(that.parentNode);
        }).catch(function(err){
            console.log(err);
        });
    }

    function getArray(){
        taskList= JSON.parse(localStorage.getItem('task')) || [];
        if(taskList.length===0){
            fetch('/data',{ mode: 'no-cors' })
            .then(function(data){
                if(data.status!==200){
                    return;
                }
                return data.json()
            }).then(function(result){
                taskList=result;
                localStorage.setItem('task',JSON.stringify(taskList));
                result.forEach(function(item){
                    display(item);
                });
            }).catch(function(err){
                console.log(err);
            });
        }else{
            taskList.forEach(function(item){
                display(item);
            });
        }
    }

})();
