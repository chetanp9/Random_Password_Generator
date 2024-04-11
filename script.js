const inputSlider=document.querySelector("[data-lengthslider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copybtn=document.querySelector("[data-copy]");
const copymsg=document.querySelector("[ data-copymsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#Lowercase");
const numbercheck=document.querySelector("#Numbers");
const symbolcheck=document.querySelector("#Symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn =document.querySelector(".generateButton");
const allcheckbox=document.querySelectorAll("input[type=checkbox]");
const symbols='~!`@#$%^&*()-_=+/*\|]}{[";:?/.>,<';

let password="";
let passwordLength=10;
let checkcount=0;
handleslider();
//set strength circle to grey
setIndicator("#ccc");



//set passwordslider
function handleslider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"%100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndINteger(min,max){
   return  Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNUmber(){
    return getRndINteger(0,9);
}

function generateLowerCase(){
     return String.fromCharCode( getRndINteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndINteger(65,91));
}

function generateSymbols(){
    let rndno=getRndINteger(0,symbols.length);
    return symbols.charAt(rndno);
}

function calStrength(){
    let hasupper=false;
    let haslower=false;
    let hasnum=false;
    let hassym=false;

    if(uppercaseCheck.checked) hasupper=true;
    if(lowercaseCheck.checked) haslower=true;
    if(numbercheck.checked) hasnum=true;
    if(symbolcheck.checked) hassym=true;

    if(hasupper&&haslower&&(hasnum||hassym)&& passwordLength>=8){
        setIndicator("#0f0");
    }
    else if(
        (haslower||hasupper)&&(hasnum||hassym)&&passwordLength>=6)
        {
        setIndicator("#0ff0");
    }
    else{
        setIndicator("#f00");
    }
}

 async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copymsg.innerText="copied";
    }
    catch(e){
        copymsg.innerText="failed";
    }
    // to make copy vala span visible
    copymsg.classList.add("active");

    setTimeout(() => {
        copymsg.classList.remove("active");
    },2000 );
}

function shufflepassword(array){
//Fisher yates method - apply on array for shuffluing;
for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    const temp=array[i];
    array[i]=array[j];
    array[j]=temp;
}
    let str="";
    array.forEach((el)=>(str +=el));
    return str;

}

function handleCheckBoxChange(){
    checkcount=0;
    allcheckbox.forEach((checkbox)=>{
        if(checkbox.checked)
          checkcount++;
    });

    //special condition
    if(passwordLength<checkcount){
        passwordLength=checkcount;
        handleslider();
    }
}

allcheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})
//handling input slider

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleslider();
})


//handling copybuttom
copybtn.addEventListener('click',()=>{
  if(passwordDisplay.value)
    copyContent();

})

generateBtn.addEventListener('click',()=>{
    //none of the checkbox are selected 
    if(checkcount ==0) 
        return ;

    if(passwordLength<checkcount){
        passwordLength=checkcount;
        handleslider();
    }

    //let start the journey to find new password
    

    //remove old password
    password="";


    //put stuff mentioned by checkboxes

    let funcarr=[];
    if(uppercaseCheck.checked)
        funcarr.push(generateUpperCase);
    
    if(lowercaseCheck.checked)
        funcarr.push(generateLowerCase);
    
    if(numbercheck.checked)
        funcarr.push(generateRandomNUmber);
    
    if(symbolcheck.checked)
        funcarr.push(generateSymbols);
    

    //compulsory additon
    for(let i=0;i<funcarr.length;i++){
        password+=funcarr[i]();
    }
    //remaining add
    for(let i=0;i<passwordLength-funcarr.length;i++){
        let ranindex=getRndINteger(0,funcarr.length);
        password+=funcarr[ranindex]();  
    }

    password=shufflepassword(Array.from(password));

    // show in ui
    passwordDisplay.value=password;
    //calculate
    calStrength();
});