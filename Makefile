SRC_DIR	=	src/

SRC_FILES	=	main.py	\

SRC	=	$(addprefix $(SRC_DIR), $(SRC_FILES))

all:
	@echo -e "\033[1;32m\n================= Compilation done ================="
	@echo -e "\033[0m"
	@python $(SRC)
