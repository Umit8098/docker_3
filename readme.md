 
**************
- (Optional) Shorten your powershell terminal prompt:
```sh
Function Prompt { "MyCode: " }
```
**************

- Full Stack bir proje, backend ve frontend i ayrı ayrı ayağa kaldıracağız.
- backend e gidiyoruz ve ilk olarak onu ayağa kaldırıyoruz,
- backend klasörü içinde bir environment oluşturuyoruz,env activate, pip install -r requirements.txt

```powershell
- cd ./backend/
- py -m venv env
- ./env/Scripts/activate
- pip install -r requirements.txt
```

- docker a geçince requirements.txt deki aşağıdaki paketler kaldırılacak, sade olsun diye, platformdan platforma geçince sıkıntı oluşturmasın diye. Şimdilik sıkıntı yok.
```text
asgiref==3.6.0
Django==4.1.4
pytz==2022.7
sqlparse==0.4.3
tzdata==2022.7
```
 
- db de tablolarımızın oluşması için migrate
```powershell
- py manage.py migrate
```

- SECRET_KEY hatası verdi, .env create edip  içine SECRET_KEY  oluşturuyoruz.

```powershell
- py manage.py migrate
```

- db de tablolarımız oluştu.

```powershell
- py manage.py runserver
```

- backendimiz oluştu, birkaç veri giriyoruz,



- yeni terminal açıp frontend e gidiyoruz ve ilk olarak onu ayağa kaldırıyoruz,
- react projesini ayağa kaldırmak için
 
```powershell
- cd ./frontend/
- yarn
- yarn start
```

- react projesi de ayağa kalktı, nerden anlıyoruz, db de girdiğimiz veriler frontend de görünüyor, frontend den veri girişi yapıyoruz, backend de görünüyor, sıkıntı yok.

### create image and container for backend

- backend ve frontend için birer tane docerfile oluşturup, bunları dockerize hale getireceğiz. Şu an db miz sqlite3, orada bir deneme yapıp daha sonrasında postgreSQL e geçeceğiz.
- backend ve frontend serverları terminallerinde Ctrl+C ile durduruyoruz.
- ilk iş docker desktop çalışıyor mu bakıyoruz, evet çalışıyor.
- backend directory de dockerfile dosyasını oluşturup yazıyoruz;
  - FROM ile container ı temel olarak hangi image dan oluşturacağımıza karar vermemiz gerekiyor,  image name python  :  tag 3.9.16-slim-bullseye
  - slim olanlar ziplenmiş hali, olmayanlar ziplenmemiş.
  - bu image ile oluşturduğumuz ve üzerine yeni paketler yükleyerek kendi image ımızı oluşturup bundan sonra kendi image ımızı oluşturacağımız projelerde temel olarak kullanabiliriz.
  - WORKDIR /backend -> dockerda container içerisinde /backend directory oluştur, terminali orada aç, komutları orada çalıştır.
  - Python arkada c ile yazılmış bir dildir. c++ diline compile ediliyor oradan çalışıyor, bu da __pycache__ deki dosyalar vasıtasıyla yapılıyor.  ENV PYTHONDONTWRITEBYTECODE=1 -> __pycache__ lerin oluşmaması için,   ENV PYTHONUNBUFFERED=1  -> env değişkenleri
  - COPY . .  -> dockerfile ın bulunduğu directory deki tüm herşeyi kopyala  container içerisinde oluşturduğun /backend directory e yapıştır.
  - RUN pip install -r requirements.txt  ->  build aşamasında requirements.txt deki paketleri container içerine yükle.
  - normalde localde ne yapıyoruz, env oluşturuyoruz ancak burada container içinde gerek yok zaten container içinde sadece bu proje çalışacak, env aktif ettikten sonra requirements ları yüklüyorduk, sonra serverı başlatıyorduk. migrate yapmayacağız çünkü sqlite3 ti de container a eklediğimiz için halihazırda db deki tablolarımız oluşmuş durumda. Ancak db miz oluşmamış olsaydı bir < RUN python manage.py migrate > dememiz gerekirdi ki içerisinde db sqlite3 oluşsun.
  - EXPOSE 8000  -> dışarıya hangi porttan çıkış yapılacağını belirtiyoruz.
  - build ettikten sonraki aşamada < CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"] >   ile server ı ayağa kaldır, "0.0.0.0:8000" portunu kullan diyoruz.

dockerfile ->

```dockerfile
FROM python:3.9.16-slim-bullseye
WORKDIR /backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY . .
RUN pip install -r requirements.txt
EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

- bir de .dockerignore file ı create ediyoruz. aynı .gitignore gibi docker ın ignore edeceği dosyaları yazıyoruz.

```dockerignore
*.pyc
*.pyo
*.mo
*.db
*.css.map
*.egg-info
*.sql.gz
.cache
.project
.idea
.pydevproject
.idea/workspace.xml
.DS_Store
.git/
.sass-cache
.vagrant/
__pycache__
dist
docs
env/
logs
src/{{ project_name }}/settings/local.py
src/node_modules
web/media
web/static/CACHE
stats
Dockerfile
Footer
node_modules/
npm-debug.log
```

#### create image for backend

- artık dockerfile ımız da hazır. dockerfile dan image create ediyoruz.
- dockerfile ın olduğu klasöre gidiyoruz,

```powershell
- docker build -t backend:v1 .  # containerdaki /backend directory ye name backend, tag v1 olan image ı oluştur 
```

- image ımızı oluşturduk, container ımızı oluşturacağız, burada birkaç farklı tag var onlardan bahsedelim,

- < docker run backend:v1>  -> backend:v1 image ından bir container ayağa kaldır. Bu bizim istediğimiz şekil değil çünkü biz lokalimizde de port a ulaşmak istiyoruz, localimizdeki localhost 8000 portu ile container daki çalışan 8000 portuna ulaşmak istiyoruz,

- < docker run -p 8000:8000 backend:v1>  -> backend:v1 image ından bir container ayağa kaldır, p port ile locaimizdeki 8000 portu ile container daki 8000 portunu birbirine eşle, yani containerda çalışan servera biz localhost 8000 den de ulaşabileyim.

- < docker run -p 8000:8000 --name backend backend:v1>  -> 
  - p port, locaimizdeki 8000 portu ile container daki 8000 portunu birbirine eşle, yani containerda çalışan servera biz localhost 8000 den de ulaşabileyim ki denemeler yapabileyim, birbirine linkliyor. 8001:8000 de diyebiliriz yani lokalimdeki 8001 portu ile linkle.
  - --name backend  ->  container a isim veriyoruz,
  - backend:v1  -> containerı bu image dan oluştur.

- image ımızdan container oluştu, requirements lar kuruldu, sqlite içindeki tablolar ile birlikte server ayağa kaldırıldı, biz de localhost:8000 den container da çalışan projeye erişebildik. 

- çalıştı ama terminalde çok kalabalık kod görüntüleri var ve bunu istemiyorsak Ctrl+C ile çıkıp, çıkamadım yeni bir terminal açtım, tekrardan bir container başlatacağız ama bu sefer container ımızı "-d" modda başlatacağız, terminal görüntileri yok artık, arka planda çalışıyor. önceki container ı siliyoruz veya container ismi olarak başka bir isim veriyoruz.
  
#### create container from image for backend

  < docker run -d -p 8000:8000 --name backend backend:v1>

  < docker run -d -p 8001:8000 backend:v1>  -> localhost 8001 portundan ulaşabilecğimiz, ismini kendisinin verdiği,  backend:v1 image ından bir container ayağa kaldırdı.

Bu terminal görüntülerine nereden ulaşıyoruz? -> docker extension ı ile çalışan container a sağ tıklayıp view log ile 

```powershell
- docker stop <container_name>
```

- şu anda db deki datalarımız kalıcı değil yani her container ayağa kaldırdığımızda siliniyor. docker-compose a geçince bunlar çözülecek.

- frontend i ayağa kaldıracağız, ikisi konuşuyor mu bakacağız, sqlite3 yi cache lemeyi göreceğiz, persistent data (kalıcı veri) olarak kullanımı, yani bir container ayağa kaldırıldığında girilen veri başka bir container ayağa kaldırıldığında da görülmesi gerekiyor. Sonra docker compose...

- image lar nereye kuruluyor? < docker info> -> nerede kurulduğuna bakılabilir. localde bir yerdir herhalde.

### create image and container for frontend

- yeni bir terminalde frontend kısmına giriyoruz, -> cd .\frontend\
- \frontend directory de dockerfile create edip içerisini yazıyoruz..

- frontend directory de dockerfile dosyasını oluşturup yazıyoruz;
  - FROM ile container ı temel olarak hangi image dan oluşturacağımıza karar vermemiz gerekiyor, burada react projesi var ve burada node kullanıyoruz,  image name node  :  tag 19-slim

  - WORKDIR /frontend -> dockerda container içerisinde /frontend directory oluştur, terminali orada aç, komutları orada çalıştır.
  - COPY . .  -> dockerfile ın bulunduğu directory deki tüm herşeyi kopyala  container içerisinde oluşturduğun /frontend directory e yapıştır.
  - RUN yarn   ->  build aşamasında 
  - EXPOSE 3000  -> dışarıya hangi porttan çıkış yapılacağını belirtiyoruz.
  - build ettikten sonraki aşamada < CMD ["yarn", "start"] >   ile server ı ayağa kaldır,

dockerfile ->

```dockerfile
FROM node:19-slim
WORKDIR /frontend
COPY . .
RUN yarn
EXPOSE 3000
CMD ["yarn", "start"]
```

- .dockerignore file ı create ediyoruz. /backend  .dockerignore ile aynı dosyaları yazıyoruz.

- dockerfile ımız da hazır, dockerfile dan image create ediyoruz.

```powershell
- docker build -t frontend:v1 .  # containerdaki /frontend directory ye name frontend, tag v1 olan image ı oluştur 
```

- ilk image oluştururken biraz zaman alıyor ama sonra aynı dockerfile dan başka bir image oluştururken cache den oluşturuyor ve daha hızlı oluyor.

- şimdi frontend i ayağa kaldıralım (oluşturduğumuz image dan container ayağa kaldırıp çalıştıralım), backend i ayağa kaldıralım ve ikisi birlikte çalışıyor mu bakalım,

```powershell
- docker run -d -p 3000:3000 --name frontend frontend:v1
```

- frontend:v1 image ımızdan, local host 3000 ile lokalimizden de görebileceğimiz (diğer 3000 i zaten dockerfile da belirtmiştik sen bu portta çalış diye), frontend isminde bir container ayağa kaldırdık, ancak backend container ı ayağa kalkmadığı için veri göremiyoruz.

- image ımızı oluşturduk, container ımızı oluşturduk, ancak frontend için container oluşturmadan önce backend container ının oluşturulması best practice dir.

### backend and frontend run container 

- backend container run

```powershell
- docker run -d -p 8000:8000 --name backend backend:v1
```

- backend:v1 image ından, backend isimli, 8000 portunda çalışan, 8000 portu ile local host umuzdan erişebildiğimiz, -d ile terminal görüntüleri arka planda görünen bir containerımız ayağa kaldırıldı.


- frontend container run

```powershell
- docker run -d -p 3000:3000 --name frontend frontend:v1
```

- frontend:v1 image ından, frontend isimli, 3000 portunda çalışan, 3000 portu ile local host umuzdan erişebildiğimiz, -d ile terminal görüntüleri arka planda görünen bir containerımız ayağa kaldırıldı.

- Evet 8000 ve 3000 portlarında çalışan ve bizim de localhost:3000 ve localhost:8000 ile erişebildiğimiz, backend ve frontend app imizin containerlarda dokerize edilerek çalıştığı ve de birbiriyle etkileşimde olduğunu gördük. Frontend ten backend e , backend den frontend e çalışıyor.


### backend and frontend docker-compose

https://docs.docker.com/compose/gettingstarted/#step-3-define-services-in-a-compose-file

- Ancak şu an farklı containerlarda çalıştıracağımız her app için ayrı dockerfile oluşturmak lazım. Ama artık docker-compose sayesinde mesela iki app (backend, frontend) için de ayrı ayrı server başlatayım, tek tek bunları kapatayım bunlarla uğraşmıyoruz.
- docker-copmose file ile bir komut ile iki server (container) da ayağa kaldıracağız, bir komut ile iki server ı da down edeceğiz, docker-copmose file ile uzun uzun hangi port hangi port ile eşleşecek onu yazmamıza gerek olmayacak, bunları docker-copmose file ında belirteceğiz.
- Sonrasında app lerimizde yaptığımız değişiklikler için tekrardan bir image oluşturup, o image dan bir container ayağa kaldırmamız gerekiyor. Öyle yapmaz isek yaptığımız değişiklikler contaier ı ayağa kaldırdığımız image da olmadığı için app imizde uygulanmayacak.  docker-compose file da yazacağımız komutlar ile app lerimizde yaptığımız değişiklikler containerlarda çalışan app lerimizde işlenmiş olacak.

- Tamaaaaam şimdi bu projemizin backend ve frontend in çalıştığı container ları stop ediyoruz, docker extension ı ile veya terminalden "-docker start|stop <container_name>" ile.

- backend ve frontend için birer tane dockerfile oluşturmuştuk, şimdi tüm proje için bir docker-compose.yaml file oluşturuyoruz. Nereye  backend ve frontend in içinde bulunduğu directory e.
- .yaml file (https://linuxhint.com/yml-vs-json-which-is-better/) json ile yaml arasında çok küçük bir yazım farklılığı var. linkten bakılabilir. 
- docker-compose.yml file ımızı yazıyoruz;
  - version: "3.8" # zorunlu değil, optional 
  - services: # iki tane servisimiz var backend, frontend
      backend:
        image: docker-compose-backend # image oluştururken image a vereceği isim
        build: ./backend # ./backend e git oradaki dockerfile ile build et
        ports:  # biraz önce manuel komutla yazdığımız container ın hangi portta çalışacağını burada belirterek artık bunları otomatik create edecek, burda tanımladığımız portu localimize bağlıyor.
          - 8000:8000
        restart: on-failure  # failure arıza olduğunda restart et (ama daha ciddi bir sorun varsa orkestration tool ları var onu da devops çular bilir.)

      frontend:
        image: docker-compose-frontend
        build: ./frontend
        ports:
          - 3000:3000 # veya 80:3000 denilebilir, 80 portu özel bir port http portu, localhost yazarak 3000 portuna bağlanabiliriz, 3000:3000 yazarsak localhost:3000 ile 3000 portuna bağlanıyorduk. 443 portu da https portudur, bunu kullanmak için sertifikalandırmak lazım, sertifikası olması lazım. 
        restart: on-failure
        depends_on:  # sırayla ayağa kalkacak ama birisi ayağa kalkmadan diğerinin ayağa kalmaması lazım. burada backend ayağa kalktıktan sonra frontend i ayağa kaldır. Bunun amacı bu.
          #- serviceName
          - backend

docker-compose.yml ->

```yml
version: "3.8" # optional

services:

  backend:
    image: docker-compose-backend
    build: ./backend
    ports:
      - 8000:8000
    restart: on-failure

  frontend:
    image: docker-compose-frontend
    build: ./frontend
    ports:
      - 3000:3000
    restart: on-failure
    depends_on:
      - backend
```

- docker-compose.yml file ımızı yazdık ve ana directoryde yeni bir terminal açıyoruz, ne backend ne de frontend de olan. docker-compose.yml file ı ile aynı seviyede.

- < docker compose up> komutunu çalıştırıyoruz,

```powershell
- docker compose up
```

- < docker compose up -d > komutumuzun sonuna -d koyarak terminal görüntülerini arka planda tut diyerek terminalimizi kalabalıktan kurtarıyoruz.,

```powershell
- docker compose up -d
```

- Çalıştırdık, ve artık terminal görüntüleri arka planda akıyor.

- Tamam test ediyoruz, localimizdeki portlardan veri girişi yapıyoruz ve frontend ve backend çalışıyor.
- Containerları durdurup silmek için down komutu kullanıyoruz ->

```powershell
- docker compose down
```

- Containerları durdurup sildik.
- Biraz önce down demeden önce veri girişi yapmıştık, şimdi tekrardan docker compose up -d diyoruz, 

```powershell
- docker compose up -d
```

##### volumes

- Localimizdeki portlardan bakıyoruz, az önce girdiğimiz veriler yok, datalarımız persistent (kalıcı) değil. İmage ımızda hangi datalar var ise onlar geliyor sadece. 
- Bunun önüne geçmek için volumes diye bir kavram giriyor devreye, normalde containerlara birer tane volume tanımlanıyor, bu volume lar localde çalışırken localde olur, containerda çalışırken belki cloud platformlarından bir volume kullanabilirsiniz, cloud platformlarındaki saklama alanlarından kullanabilirsiniz, veya bu container ı ayağa kaldırdığınız server içerisinde bir alanda volume tanımlayıp, her container ayağa kaldırıldığında o volume üzerinden devam etmesini, birşey yazacağı zaman o volume yazmasını, tekrardan bir container ayağa kaldırdığı zaman da o volume üzerinden kaldığı yerden devam etmesini sağlayabiliriz.
- db sqlite3 localde olduğu için buna localde bir volume tanımlayabiliriz. 
- docker-compose.yml file ımıza localimizde bir volume tanımlayacağız,
- ./backend içerindeki db.sqlite3 yi localimdeki volume olarak kullan, neyi yazacaksın buraya? container içerisindeki /backend içerisindeki db.sqlite3 yi yazacaksın! ilki localimizdeki yol, ikincisi containerdaki yol.

```docker-compose.yml
    volumes:
      - ./backend/db.sqlite3:/bacend/db.sqlite3
```

- Tabi bu sqlite3 olduğu için böyle, normalde böyle değil, postgresql e geçtiğimizde göstereceğiz bunun nasıl olduğunu. Development serverınızda bu çalışmayabilir belki sqli3 olduğundan dolayı, ama postgresql hem development, hem localde aynı şekilde çalışacak. 

- Tekrardan bir < docker compose down> ile containerlarımızı down ediyoruz,

- Ardından tekrar  < docker compose up -d> ile volumes tanımladıktan sonraki duruma bakacağız.
```powershell
- docker compose up -d
```

- localimizde çalıştırıyoruz, bakıyoruz yine image create ederken oluşturduğumuz datalar var, sonradan girdiğimiz datalar silinmiş. Şimdi volumes tanımladıktan sonra oluşturduğumuz datalar container ı down/up yaptığımızda silinecek mi yoksa kalacak mı ona bakıyoruz.
- localden frontend den data giriyoruz, backend de db mizde görüyoruz, 

- Tekrar < docker-compose down> ardından < docker-compose up -d> yapıp tekrar localden frontend ve backend de önceki girdiğimiz dataların konmuş olduğunu gördük.




- Dockerize ortamda çalışıyoruz ya, mesela frontend e gidiyoruz, src -> componenets -> AddTutorial.jsx de bir değişiklik yaptık, bu değişiklik dockerize olmuş container ımızdaki frontend e yansımıyor. Bu değişikliğin yansıması için tekrardan < docker compose down>, ardından tekrar < docker compose up -d> -> refresh yapıyoruz 
- ama değişiklikler tabi yine yansımıyor çünkü yaptığımız değişikliği image a eklemedik. 
- Tekrar < docker compose down> ile containerları down ediyoruz,
- Onun için < docker compose up -d --build>  komutu ile yaptığımız değişikliği image a da ekle ve o image ile container oluştur diyoruz. İmageları ve containerları yeniden yaptığımız değişikliği de içerecek şekilde yeniden containerları ayağa kaldıryor.

```powershell
- docker compose up -d --build
```

- Evet frontend kısmı için yaptığımız değişiklikler şimdi yansımış.
- Ama bu çok mantıklı da değil, yani her seferinde build etmek zorunda değiliz. Yani localimizde yaptığımız değişikliği anında container ımızda da oluşmasını sağlayabiliyoruz, bunu da yine volümes ile sağlıyoruz.
- Yani bir volümes tanımlıyoruz ve o volumes de yaptığımız değişiklikleri ona bakarak kaydet diyoruz.
- Yine .yml dosyamıza gidiyoruz,  ve frontend için bir volumes tanımlıyoruz.

```docker-compose  
    volumes:
      - ./frontend:/frontend
```  

- Biraz önce backend için yaptığımız durum tam tersi durumlar için de işliyor. Backend de containerdaki değişiklik bizim localimizdeki db mizde işlenmişti, burada yani frontend de localimizdeki değişiklik container ımıza işleniyor. 
- Bunu test ediyoruz, container ımızı < docker compose down> ile down ediyoruz, localimizdeki frontend de bir değişiklik yaptık ve --build demeden < docker compose up -d> ile container ımızı ayağa kaldırıyoruz.
- container ayağa kalktı, frontend çok geç çalıştı. Container çalışırken yaptığımız değişiklikler yansımadı!!!  

  
- Yine .yml dosyamıza gidiyoruz,  ve backend için bir volumes tanımlıyoruz.

```docker-compose  
    volumes:
      - ./backend:/backend
```  

< docker compose up -d> ile container ımızı ayağa kaldırıyoruz, backend de yaptığımız değişiklik (mesela fieldlarda) anında çalışan container da yansıyor.


### Postgresql db ye bağlama

- version -> optional 
- services -> frontend, backend veya backendde farklı 
  servisleri farklı containerlar içine alacaksınızdır onlar ayrı bir servistir, db ayrı bir container da olacaktır o ayrı bir servistir. Bu servisler tek tek tanımlanır. şu an sadece frontend ve backend var.
- image -> servisler içindeki dockerfile lardan image 
  create edecek,
- build -> nereden build edeceğini söylüyoruz, 
- port -> serverınızdan dockera hangi porttan 
  erişeceğinizi belirtiyoruz.
- restart -> başka parametreleri de var ama genelde 
  on-failure kullanılıyor.
- depends_on -> bunun anlamı backend containerı ayağa 
  kalkmadan frontend containerını çalıştırma.
- volumes -> localimizde yaptığımız değişikliklerin 
  containera yansıması için yazıyoruz, aynı şey backend için de geçerli backend te ekstra bir de db için, db de dataların kalıcı olması için volumes yazdık. 


- Container çalıştırdıktan sonra, çalışırken, container içeriside komut çalıştırabiliriz. Mesela çalışan container içindeki backend service mizde python manage.py migrate komutunu çalıştırabiliyoruz.
- docker compose up -d  (-d modda çalıştırıyoruz ki terminali de kullanabilelim. )

```powershel  
- docker compose exec backend python manage.py migrate
```  


- Mesela superuser oluşturalım;

```powershel  
- docker compose exec backend python manage.py createsuperuser
```  


- PostgreSQL bağlantısı yapmak için; 

- backend service mizin settings.py ına gidip, 
- burada decouple ayarı yapmayacağız, sadece sqlite3 yi postgresql e çevireceğiz.
- settings.py dosyasına aşağıdaki kodları yazıyoruz, config ile gizlediğimiz kısımların kodlarını .env dosyasına yazıyoruz.

settings.py ->

```py
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("SQL_DATABASE"),
        "USER": config("SQL_USER"),
        "PASSWORD": config("SQL_PASSWORD"),
        "HOST": config("SQL_HOST"),
        "PORT": config("SQL_PORT"),
        "ATOMIC_REQUESTS": True,
    }
}
```

- .env file ı içerisine gizlemek istediğimiz db ayarlarımız yazıyoruz. ->

SQL_PORT = 5432 # sabittir standart

```.env
SQL_DATABASE = 
SQL_USER =
SQL_PASSWORD =
SQL_HOST = 
SQL_PORT = 5432
```

- docker-compose.yml file ımıza gidiyoruz, 
- services kısmına bir service daha ekliyoruz. Bu service de artık database servis olacak. İtediğimiz ismi verebiliriz. Biz "db" diyoruz
- image:   
    - bizim database imiz için bir dockerfile 
      ımız yok, bu kısımda işler biraz değişik, burada image kısmında docker hup  tan hangi image ı kullanacaksak onu yazıyoruz, çünkü bizim frontend yada backend service lerinde olduğu gibi bir dockerfile ımız yok. dockerfile ımız olmadığı için build de yazmayacağız. Buraya postgresql ile ilgili (biz db olarak postgresql kullanacağımız için ) docker hup tan hangi image ı çekmemiz gerekiyorsa onu yazıyoruz.
    - docker hub a gidiyoruz, arama çubuğuna 
      postgresql yazıyoruz ve çıkan sonuçlardan en üsttekini seçim tagleri arasından bakıyoruz. (alpine lar en küçükleri oluyor). tags başlığı altında alpine aratıyoruz, 78 mb lık bir alpine 13-alpine ı yazmaya karar veriyoruz.
    - image yazarken önce image ın ismi, sonra :, sonra image ın tag ini yazıyoruz. yani -> postgres:14.0-alpine   Bu image dan bana bir container ayağa kaldır diyoruz.

docker-compose.yml ->

```yml
  db:
    image: postgres:13-alpine
```


- Bir de backend service imizdeki dockerfile kullandığımız image ın tag ini  3.9.16-bullseye olarak değiştiriyoruz. Bu image lar sıkıntı olabiliyor. Çalışan bir tane bulunca onunla devam etmeli.

- Arkasından bir environment değişkeni tanımlıyoruz. Burada tanımlayacağımız environmet değişkenleri ile .env içerisinde tanımladığımız environment değişkenleri farklı.
  - POSTGRES_USER=ümit
  - POSTGRES_PASSWORD=ümit123456
  - POSTGRES_DB=docker_django_umit

docker-compose.yml ->

```yml
  db:
    image: postgres:13-alpine
        environment:
      - POSTGRES_USER=ümit
      - POSTGRES_PASSWORD=ümit123456
      - POSTGRES_DB=docker_django_umit
```

    - Bunlar standarttır. Postgres db 
      oluştururken bu değişkenleri oluşturmak zorundasınız, bu environment değişkenlerini oluşturduğunuz container a göndermek zorundasınız.
    - Bu kısım .env den farklı. Normalde .env 
      neydi; database oluştuktan sonra backendime diyorum ki, arkadaş git şu db'ye userı bu olan, passwordü bu olan db'ye bağlan. Ama ilk başta o userı, o passwordü, o db yi oluşturmamız lazım, ne yapıyorduk pgAdminde bir db oluşturuyorduk, user ve passwordü de belirlemiş oluyorduk ve o bilgileri environment imize yazıyorduk.
    - Aslında burada yaptığımız işlem de 
      oluşturduğumuz containerda bir user oluşturmak ve oluşturduğu serverda da verdiğimiz isimle bir database oluşturmak.
- Tamam şimdi bu tanımladığımız 
  değişkenleri .env ye tanımlamamız lazım ki django bu db' ye  bağlanabilsin
- HOST kısmına docker da sadece service ismini 
  yazmak yeterli (yani burada servis ismi olarak db vermiştik.)

```.env
SQL_DATABASE = docker_django_umit
SQL_USER = umit
SQL_PASSWORD = umit123456
SQL_HOST = db
SQL_PORT = 5432
```

- Şmdi bizim backendimizin oluşması için db nin 
  ayağa kalkması lazım. Yani önce db ayağa kalkacak, sonra backendimiz ayağa kalkacak. Bunun için backend service imizde bir depends_on yazıyoruz. depends_on a da service ismimiz olan db yazıyoruz. Yani db ayağa kalktıktan sonra backend ayağa kalkabilir.

docker-compose.yml ->

```yml
  backend:
    ....
    depends_on:
      - db
```

- Burada da bir volumes tanımlayacağız ama 
  buradaki biraz farklı olacak. db miz bir serveda çalışacak, postgresql datalarının standart olarak kaydedildiği bir yer var. Linux bilgisayarlarında postgresql db nin datalarının tutulduğu location hep aynıdır. Biz kendi localimizde ayrı bir volume açacağız ve o volüme e kaydetmesini isteyeceğiz. Bu volüme e istediğimiz ismi verebiliriz, pg_data diyoruz. Sonra da standart linux serverında çalışan her postgresql in datasının kaydedildiği location ı yazıyoruz. /var/lib/postgresql/data/  serverda, container da burada kaydediliyor.
- Yani diyoruz ki ben pg_data diye bir volume 
  oluşturacağım, /var/lib/postgresql/data/  daki datayı oraya kaydet.

docker-compose.yml ->

```yml
  db:
    ....
    volumes:
      - pg_data:/var/lib/postgresql/data/
```

- Daha önce backend service inde sqlite3 için  oluşturmuş olduğumuz volume ü artık kaldırabiliriz.
   ./backend/db.sqlite3:/backend/db.sqlite3

- Şimdi diğerlerinden farklı olan kısma geldik, 
  bizim bu volumes ü localimizde oluşturmamız lazım. Yani backend service de backend e karşılık gelen bir yer var ama postgresql e karşılık gelen bir location yok, bunun için localimizde kaydedecek bir alan açıyoruz. Yukarıda bu alana pg_data demiştik.aynı isimle localimizde bir volume açıyoruz.

docker-compose.yml ->

```yml
  db:
    ....
    volumes:
      - pg_data:/var/lib/postgresql/data/

volumes:
  pg_data:
```

- Artık volumes olarak pg_data diye bir alan 
  açacak ve containerdaki db ye yazılan tüm datalar bu localimizdeki yere kaydedilecek ve biz artık container ı down edip tekrar çalıştırdığımızda datalar kaldığı yerden devam edebilecek.

- Database imizi postgresql olarak ayarladık 
  ama, postgresql ile çalışabilmemiz için psycope2 diye bir paket kurmamız lazım. pip install psycopg2 ile paketimizi kuruyorduk. MacOs ve Linux için çalışmaz ise pip install psycopg2-binary ile kuruyorlar. 
- Biz container da linux işletim sistemi ile 
  çalışacağımız için psycopg2-binary>=2.8  yi requirements.txt ye ekliyoruz. Böylelikle compose up yapınca bu paket de yüklenecektir.(bu paketin şu versiyonundan büyük veya eşit olanı yükle manasında)

requirements.txt

```txt
asgiref==3.6.0
Django==4.1.4
django-cors-headers==3.13.0
djangorestframework==3.14.0
python-decouple==3.6
pytz==2022.7
sqlparse==0.4.3
tzdata==2022.7
psycopg2-binary>=2.8
```

- Ayrıca requirements.txt ye baktığımız zaman 
  aynı paketlerin tekrar yüklenmesi gibi bir durum görünüyor. Mesela Django zaten djangorestframework yüklenirken yükleneceği için bunusilebiliriz. Ayrıca asgiref, pytz, sqlparse, tzdata paketleri de Django yüklenirken geldikleri için bunları da silebiliriz. 
  
requirements.txt

```txt
django-cors-headers==3.13.0
djangorestframework==3.14.0
python-decouple==3.6
psycopg2-binary>=2.8
```

- Bunu şundan dolayı yapıyoruz windows machine 
  de çalışanlar sıkıntı yaşayabilirler. Mesela bazılarında windowslarda pywin32 diye bir paket oluyor, bunlar bazen hata verebiliyor. Burada default ana paketleri yazarsak kafamız rahat eder.

- backend dockerfile ında image tag ini 
  3.9.16-bullseye olarak değiştirmiştik.

- database yeni tanımladığımız için migrate yapmamız gerekiyor.

```powershell
- docker compose exec backend python manage.py migrate
```


#### docker komutlar

docker compose down -v    -> volume ler ile birlikte siler. Bu şekilde silersek tekrardan migrate yapmamız gerekir.

docker compose up      -> container ayağa kaldırır, terminal görüntüleri de gelir.
docker compose up -d   -> container ayağa kaldırır, terminal görüntüleri arka planda kalır, buradan komut vermeye devam edebiliriz.

docker compose down      -> containerı down eder. 
docker compose down -v   -> containerı ve volumes down eder.


docker system prune    -> sistemi temizliyor, siliyor.