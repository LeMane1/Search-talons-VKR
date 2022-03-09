<template>
  <div class="main">
    <div class="main-wrapper">
      <!--Intro block-->
      <div class="intro">
        <div class="intro-text">
          <h1 class="intro-title">Запись к врачу стала проще</h1>
          <div class="intro-advan-cont" v-for="image in images" :key="image.id">
            <img
              :src="getImgUrl(image.filename)"
              alt="Icon"
              class="intro-icon"
            />
            <p class="intro-advan-text">{{ image.text }}</p>
          </div>
        </div>
        <div class="intro-pic-cont">
          <img src="../assets/doctor.jpg" alt="Врач" class="intro-pic" />
        </div>
      </div>

      <!--Description block-->
      <div class="working-cont">
        <p class="forms-title">Как работает сервис?</p>
        <div class="working-text">
          <div class="working-first-cont">
            <div class="working-first-pic-class">
              <img
                src="../assets/working.jpg"
                alt="Сервис"
                class="working-first-pic"
              />
            </div>
            <div class="working-first-text">
              <p class="working-text-par">
                Данный сервис работает только на территории Санкт-Петербурга.
                Для поиска талонов используется портал
                <a
                  target="blank"
                  href="https://gorzdrav.spb.ru/"
                  class="gorzdrav-link"
                  >Здоровье Петербуржца</a
                >. На данном портале выкладываются талоны для посещения врача,
                однако отследить их не так просто. В этом поможет данный сервис.
              </p>
              <p class="working-text-par">
                Для того, чтобы узнать количество талонов к вашему врачу,
                выполните несколько <b class="bolded">действий:</b>
              </p>
            </div>
          </div>

          <!--Steps block-->
          <div class="working-actions">
            <div class="working-action">
              <p class="working-action-title">
                Выберите удобный для вас район города
              </p>
              <img
                src="../assets/icons/icon-ArrowDown.svg"
                alt=""
                class="working-action-icon"
              />
            </div>
            <div class="working-action">
              <p class="working-action-title">
                Выберите поликлинику в указанном районе
              </p>
              <img
                src="../assets/icons/icon-ArrowDown.svg"
                alt=""
                class="working-action-icon"
              />
            </div>
            <div class="working-action">
              <p class="working-action-title">
                Выберите врача в предпочитаемой поликлинике
              </p>
              <img
                src="../assets/icons/icon-ArrowDown.svg"
                alt=""
                class="working-action-icon"
              />
              <p class="working-action-title">
                Узнайте сколько талонов доступно на данный момент
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="forms">
        <p class="forms-title">Заполните поля выбора</p>

        <!--Region selector-->
        <p class="form-title">Выберите район города</p>
        <select
          v-model="selectRegion"
          class="select-region"
          @change="callApiPoly"
        >
          <option disabled value="">Выберите один из вариантов</option>
          <option
            v-for="region in regions"
            :key="region.id"
            :value="region.value"
          >
            {{ region.name }}
          </option>
        </select>

        <!--Polyclinic selector-->
        <transition name="fade" mode="out-in">
          <div v-if="loading.poly" class="loader" key="loaderPoly">
            <Loader/>
          </div>

          <div v-else key="polyclincs">
            <p class="form-title">Выберите поликлинику</p>
            <select
              v-model="selectPoly"
              class="select-region"
              style="margin-bottom: 20px"
              :disabled="selectRegion ? false : true"
              @change="callApiDoctor"
            >
              <option disabled value="">Выберите один из вариантов</option>
              <option
                v-for="polyclinic in polyclinics"
                :key="polyclinic.ind"
                :value="polyclinic.ind"
              >
                {{ polyclinic.title }}
              </option>
            </select>
          </div>
        </transition>

        <!--Address of finded polyclinic-->
        <transition name="fade" mode="out-in">
          <p
            v-html="this.polyAddress"
            v-if="selectPoly"
            class="addressPoly"
          ></p>
        </transition>

        <!--Doctor selector-->
        <transition name="fade" mode="out-in">
          <div v-if="loading.doctor" class="loader" key="loaderDoctor">
              <Loader/>
          </div>

          <div v-else key="doctors">
            <p class="form-title">Выберите врача</p>
            <select
              v-model="selectDoctor"
              class="select-region"
              :disabled="
                !selectPoly ||
                !doctors ||
                doctors === 'error_our_service' ||
                doctors === 'error_service_gorzdrav'
              "
            >
              <option disabled value="">Выберите один из вариантов</option>
              <option
                v-for="doctor in doctors"
                :key="doctor.ind"
                :value="doctor.ind"
              >
                {{ doctor.doctor }}
              </option>
            </select>
          </div>
        </transition>

        <!--Error block-->
        <transition name="fade" mode="out-in">
          <div v-if="this.error.service">
            <p class="error-class">Ошибка! Сервис не отвечает.</p>
          </div>
          <div v-else-if="this.error.gorzdrav">
            <p class="error-class">
              Ошибка! Портал "Здоровье Петербуржца" не отвечает.
            </p>
          </div>
        </transition>

        <transition name="fade" mode="out-in">
          <div v-if="selectDoctor">
            <p class="resultNumber">
              На данный момент доступно номерков: {{ this.resultQuantity }}
            </p>

            <div v-if="hasTalons">
              <a :href="vizitLink" class="vizit-link" target="blank"
                >Записаться</a
              >
            </div>
            <div v-else class="noTalonsActionsCont">
              <div class="ActionCont">
                <p>
                  Посмотрите профиль врача в других поликлиниках выбранного
                  района.
                </p>
                <button class="btn-stand" @click.prevent="callApiSearch">
                  Искать
                </button>
              </div>
              <div class="ActionCont">
                <p>Создайте уведомление о поступлении номерков ко врачу.</p>
                <button class="btn-stand" @click.prevent="noticeCreateFunc">Создать</button>
              </div>

              <!--Block about talons in another polyclinics-->
              <transition name="fade" mode="out-in">
                <div v-if="loading.search" class="loader" key="loaderSearch">
                  <Loader/>
                </div>

                <div v-else key="search" class="resultSearchCont">
                  <div v-if="searchResults">
                    <div v-for="res in searchResults" :key="res.quantity" class="resultSearch">
                    <p class="resultSearchPoly">{{res.poly}}</p>
                    <div class="resultSearchDoc">
                      <p>{{res.doctor}}</p>
                      <p>{{res.quantity}}</p>
                    </div>
                    <a :href="res.url" class="vizit-link" target="blank"
                    >Записаться</a>
                    </div>
                  </div>
                  <div v-else-if="this.noSearched">
                    <p>Доступных номерков нет</p>
                  </div>
                </div>
              </transition>

              <!--Block about creating a notice to get talons-->
              <transition name="fade" mode="out-in">
                <div v-if="noticeCreate" key="notice" class="noticeCreate">
                  <p>Уведомление о поступлении номерков</p>
                  <p>Район: {{currentRegion}}</p>
                  <p>Поликлиника: {{currentPoly}}</p>
                  <p>Врач: {{currentDoc}}</p>
                  <input placeholder="Введите вашу почту" type="email" minlength="3" v-model="emailNotice"/>
                  <button class="btn-stand" :class="{disBtn: emailNotice.length <= 3}">Создать</button>
                </div>
              </transition>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "./Loader.vue";
import CallApi from "../mixins/callApi";
export default {
  components: {
    Loader,
  },
  mixins: [CallApi],
  data() {
    return {
      images: [
        {
          id: 1,
          filename: "icon-Clock.svg",
          text: "Не нужно ждать появления талонов на сайте",
        },
        {
          id: 2,
          filename: "icon-Calendar2Check.svg",
          text: "Возможность проверить наличие талонов на данный момент",
        },
        {
          id: 3,
          filename: "icon-Speedometer.svg",
          text: "Быстрый поиск талонов в пару кликов",
        },
        {
          id: 4,
          filename: "icon-CalendarDate.svg",
          text: "Получите уведомление о появлении талонов на электронную почту",
        },
      ],
      selectRegion: "",
      selectPoly: "",
      selectDoctor: "",
      regions: [
        { id: 1, value: "adm", name: "Адмиралтейский" },
        { id: 2, value: "vas", name: "Василеостровский" },
        { id: 3, value: "vyb", name: "Выборгский" },
        { id: 4, value: "kal", name: "Калининский" },
        { id: 5, value: "kir", name: "Кировский" },
        { id: 6, value: "kol", name: "Колпинский" },
        { id: 7, value: "kra_gvar", name: "Красногвардейский" },
        { id: 8, value: "kra_sel", name: "Красносельский" },
        { id: 9, value: "kro", name: "Кронштадтский" },
        { id: 10, value: "kur", name: "Курортный" },
        { id: 11, value: "mos", name: "Московский" },
        { id: 12, value: "nev", name: "Невский" },
        { id: 13, value: "pet_grad", name: "Петроградский" },
        { id: 14, value: "pet_dvor", name: "Петродворцовый" },
        { id: 15, value: "pri", name: "Приморский" },
        { id: 16, value: "push", name: "Пушкинский" },
        { id: 17, value: "fru", name: "Фрунзенский" },
        { id: 18, value: "cen", name: "Центральный" },
      ],
      polyclinics: [],
      doctors: [],
      searchResults: [],
      noSearched: '',
      loading: {        //loadings for queries
        poly: false,
        doctor: false,
        search: false
      },
      error: {          //sending error
        service: false,
        gorzdrav: false,
      },
      hasTalons: "",
      noticeCreate: "",
      emailNotice: "",
    };
  },
  computed: {                     //computed properties
    resultQuantity: function () {
      const quan = this.doctors.find(element => element.ind === this.selectDoctor).quantity;
      const regexp = /\d+/;
      if (!quan.match(regexp)) {
        this.hasTalons = false;
        return 0;
      } else {
        this.hasTalons = true;
        return quan.match(regexp).join("");
      }
    },
    vizitLink: function () {
      return this.doctors.find(element => element.ind === this.selectDoctor)
        .url;
    },
    polyAddress: function () {
      return this.polyclinics.find(element => element.ind === this.selectPoly)
        .address;
    },
    currentPoly: function () {
      return this.polyclinics.find(element => element.ind === this.selectPoly).title;
    },
    currentDoc: function () {
      return this.doctors.find(element => element.ind === this.selectDoctor)
        .doctor;
    },
    currentRegion: function () {
      return this.regions.find(el => el.value === this.selectRegion).name
    }
  },
  methods: {
    getImgUrl(pic) {
      return require("../assets/icons/" + pic);
    },
    async callApiPoly() {     //get polyclinics method
      this.error.gorzdrav = false;
      this.error.service = false;
      this.selectPoly = "",
      this.selectDoctor = "",
      this.polyclinics = "",
      this.doctors = "",
      this.loading.poly = true;
      this.polyclinics = await this.sendReq(
        "http://localhost:3000/api/regions",
        "POST",
        { region: this.selectRegion }
      );
      if (this.polyclinics === "error_our_service") {
        this.selectPoly = "";
        this.error.service = true;
      } else if (this.polyclinics === "error_service_gorzdrav") {
        this.selectPoly = "";
        this.error.gorzdrav = true;
      }
      this.loading.poly = false;
    },
    async callApiDoctor() {     //get doctors method
      this.loading.doctor = true;
      this.error.gorzdrav = false;
      this.error.service = false;
      this.selectDoctor = "";
      this.doctors = "";
      this.doctors = await this.sendReq(
        "http://localhost:3000/api/poly",
        "POST",
        { region: this.selectRegion, index: this.selectPoly }
      );
      if (this.doctors === "error_our_service") {
        this.error.service = true;
        this.selectDoctor = "";
      } else if (this.doctors === "error_service_gorzdrav") {
        this.error.gorzdrav = true;
        this.selectDoctor = "";
      }
      this.loading.doctor = false;
    },
    async callApiSearch() {         //searching doctors in other polyclinics method
      this.loading.search = true;
      this.searchResults = await this.sendReq(
        "http://localhost:3000/api/search",
        "POST",
        { region: this.selectRegion, doctor: this.currentDoc }
      )
      if (!this.searchResults){
        this.noSearched = true
      }
      this.loading.search = false;
    },
    noticeCreateFunc(){
      this.noticeCreate = true
    }
  },
};
</script>

<style>
@import "../assets/main.css";
</style>