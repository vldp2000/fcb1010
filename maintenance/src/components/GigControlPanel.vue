<template>
 <v-container grid-list-md text-md-center fluid fill-height class="darkBackgroud">

      <v-row no-gutters>
        <div style="height=50px;">
          <label>Program A</label>
        </div>
      </v-row>

      <v-row no-gutters>
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
  /* .v-card {
    color: rgba(36, 34, 34, 0.856)
  } */
  .darkBackgroud {
    background-color:rgba(36, 34, 34, 0.856)
  }
</style>
