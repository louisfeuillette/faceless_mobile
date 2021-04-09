<Text style={styles.title}>Change ta ville : </Text>
          <View style={styles.containerContent}>
            {!cityVisible ? (
              <>
                <Text style={styles.subtitle}>
                  {/* {localisation.label} */}
                  {localisation == " " || localisation == "undefined" ? "France" : localisation}
                </Text>
                <TouchableOpacity onPress={handlePressCity}>
                  <Ionicons name="pencil" size={18} color="#5571D7" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Geolocalisation
                lieu={localisation}
                getValueParent= {()=>{}}
                />
                <TextInput
                  style={styles.subtitleChanged}
                  placeholder="Tu peux changer ta ville  "
                  onChangeText={(value) => {
                    setLocalisation(value);
                  }}
                />
              </>
            )}
          </View>