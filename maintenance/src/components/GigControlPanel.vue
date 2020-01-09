<template>
 <v-container grid-list-md text-md-center fluid fill-height class="darkBackgroud">

      <v-row no-gutters>

        <div class="rotated-up">
          <b>Program A</b>
        </div>

        <v-col md3 d-flex>
          <v-card class="pa-1" dark >
            <preset imageURL='/img/image_01.3f6122bf.png'/>
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>

      </v-row>

      <v-row no-gutters>
        <b>Program B</b>
      </v-row>

      <v-row md12 no-gutters>

        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>

      </v-row>

      <v-row md12 no-gutters>
        <b>Program C</b>
      </v-row>

      <v-row md12 no-gutters>

        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
      </v-row>

      <v-row md12 no-gutters>
        <b>Program D</b>
      </v-row>

      <v-row md12 no-gutters>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
      </v-row>

    </v-container>
</template>

<style scoped>
  .preset {
    margin: 5px;
  }
  .v-card {
    color: rgba(36, 34, 34, 0.856);
    padding: 2px;
  }
  .darkBackgroud {
    background-color:rgba(36, 34, 34, 0.856)
  }

.rotated-up {
  width: 20px;
  height: 80px;
  background-color: blueviolet;
  -ms-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
  filter: none; /* Mandatory for IE9 to show the vertical text correctly */
  -ms-transform-origin: center center 0;
  -moz-transform-origin: center center 0;
  -webkit-transform-origin: center center  0;
  transform-origin: center center 0;
}
</style>
