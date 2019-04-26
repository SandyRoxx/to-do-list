(function() {

    var inp = document.getElementById('inp');
    var result = document.getElementById('result');
    var taskList = [];
    getArray();
    
    inp.addEventListener('keypress', function(event) {
        if (event.keyCode == 13) {
            addLi();  
        }
    });

    function addLi(){
        var val = inp.value;
       
        fetch('/add',{
           method:'POST',
           headers:new Headers({'content-type': 'application/json'}),
           body:JSON.stringify({"task":val})

        }).then(function(data){
            if(data.status!==200){
                return;
            }
            return data.json();
        }).then(function(result){
            taskList.push(result);
            display(result);
            localStorage.setItem('task',JSON.stringify(taskList)); 
            inp.value="";    
        }).catch(function(err){
            console.log(err);
    });


    }

    function display(obj) {
        var li = document.createElement('li');
        li.setAttribute('id', obj._id);

        var spanleft = document.createElement('span');
        spanleft.classList.add('left');
        spanleft.addEventListener('click', deleteLi, false);
        var ileft = document.createElement('i');
        ileft.classList.add('fa', 'fa-trash');
        spanleft.append(ileft);
        li.append(spanleft);

        var spancenter = document.createElement('span');
        var dataNode= document.createTextNode(obj.task);
        spancenter.append(dataNode);
        li.append(spancenter);

        var spanright = document.createElement('span');
        spanright.classList.add('right');
        spanright.addEventListener('click', updateLi, false);
        var iright = document.createElement('i');
        iright.classList.add('fa', 'fa-edit');
        spanright.append(iright);
        li.append(spanright);
        result.prepend(li);
    }


    function updateLi() {
        var spancenter = this.previousSibling;
        var li=this.parentNode;
        var pid = li.id;
        index = taskList.map(function(obj) { return obj._id; }).indexOf(pid);
        var input = document.createElement('input');
        input.type = 'text';
        input.value = spancenter.textContent;
        input.style.width="240px";
        input.style.height="40px";
        li.replaceChild(input, spancenter);
        input.focus();
        input.addEventListener('keypress', function(event) {
            if (event.keyCode == 13) {
                var newvalue =input.value;
                fetch('/update',{
                    method:'POST',
                    headers:new Headers({'content-type': 'application/json'}),
                    body:JSON.stringify({"index":index,"id":pid,"newvalue":newvalue})
                }).then(function(data){
                    if(data.status!==200){
                        return;
                    }
                    return data.json();
                }).then(function(result){
                    spancenter.innerHTML=newvalue;
                    li.replaceChild(spancenter, input);
                    taskList=result;
                    localStorage.setItem('task',JSON.stringify(taskList));

                }).catch(function(err){
                    console.log(err);
                });
                
            }

        });
    }


    function deleteLi() {
        var that = this;
        var pid = this.parentNode.id;
        index = taskList.map(function(obj) { return obj._id; }).indexOf(pid);
       
        fetch('/delete',{method:'POST',
        headers:new Headers({'content-type': 'application/json'}),
        body:JSON.stringify({"index":index,"id":pid})

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
                return data.json();
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
